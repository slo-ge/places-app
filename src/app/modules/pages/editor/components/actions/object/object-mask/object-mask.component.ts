import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CustomImageBox } from "@app/core/editor/fabric-object.utils";
import { fabric } from "fabric";
import { ClipPath } from "@app/core/model/preset";


/**
 * This sets the scaled mask related to the image where it should be applied
 * @param target
 * @param mask
 */
export function applyMaskWithCorrectScales(target: fabric.Image, mask: fabric.Circle | fabric.Rect) {
  let newMask;
  if (mask.type === 'circle') {
    newMask = new fabric.Circle({
      radius: (mask as fabric.Circle).radius,
      height: mask.height,
      width: mask.width,
      scaleX: 1 / target.scaleX! * mask.scaleX!,
      scaleY: 1 / target.scaleY! * mask.scaleY!,
    });
  } else {
    newMask = new fabric.Rect({
      width: mask.width,
      height: mask.height,
      scaleX: 1 / target.scaleX! * mask.scaleX!,
      scaleY: 1 / target.scaleY! * mask.scaleY!,
    });
  }

  newMask.left = mask.left! / target.scaleX!;
  newMask.top = mask.top! / target.scaleY!;
  newMask.dirty = true;
  return newMask;
}

/**
 * ClipPath which will be persisted
 * @param mask, object which will be used for masking
 * @param inverted, inverted mask
 */
export function getInternalClipPath(mask: fabric.Circle | fabric.Rect, inverted: boolean): ClipPath {
  return {
    type: mask.type === 'circle' ? 'circle' : 'rect',
    height: mask.height!,
    width: mask.width!,
    scaleX: mask.scaleX!,
    scaleY: mask.scaleY!,
    left: mask.left!,
    top: mask.top!,
    radius: (mask as fabric.Circle).radius,
    inverted
  };
}

export function removeMask(image: CustomImageBox) {
  image.clipPath = undefined;
  image.__internalClipPath = undefined;
}

@Component({
  selector: 'app-object-mask',
  templateUrl: './object-mask.component.html',
  styleUrls: ['./object-mask.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ObjectMaskComponent implements OnChanges {
  @Input()
  activeObject!: fabric.Group | CustomImageBox;

  maskMode = false;
  removeClipPath = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (this.activeObject) {
      if (this.activeObject instanceof fabric.Group) {
        this.maskMode = this.activeObject.getObjects && this.activeObject.getObjects().length == 2;
      }

      if (this.activeObject.clipPath) {
        this.removeClipPath = true;
      }
    }
  }

  render() {
    this.activeObject.canvas?.renderAll();
  }

  applyMask(inverted: boolean = false) {
    if (this.activeObject instanceof fabric.Group) {
      const mask = this.activeObject.getObjects()[1];
      const target = this.activeObject.getObjects()[0] as CustomImageBox;

      // internalClipPath will be persisted and reapplied on render with applyMaskWithCorrectScales
      target.__internalClipPath = getInternalClipPath(mask, inverted);
      target.clipPath = applyMaskWithCorrectScales(target, mask);
      target.clipPath.inverted = inverted;

      this.activeObject.canvas?.remove(mask);
      this.render();
    }
  }

  removeMask() {
    removeMask(this.activeObject as CustomImageBox);
    this.render();
  }
}
