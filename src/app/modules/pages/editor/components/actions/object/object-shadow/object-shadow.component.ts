import {Component, Input, OnChanges, OnDestroy, SimpleChanges} from '@angular/core';
import {CustomObject} from "@app/core/editor/fabric-object.utils";
import {fabric} from "fabric";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Subscription} from "rxjs";
import {Shadow} from "fabric/fabric-impl";

@Component({
  selector: 'app-object-shadow',
  templateUrl: './object-shadow.component.html',
  styleUrls: ['./object-shadow.component.scss']
})
export class ObjectShadowComponent implements OnChanges, OnDestroy {
  @Input()
  activeObject!: CustomObject;

  form!: FormGroup;
  formCollapsed = false;
  private formSubscription = Subscription.EMPTY;

  constructor(private fg: FormBuilder) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.formSubscription.unsubscribe();

    if (this.activeObject) {
      if (!this.form) {
        this.form = this.fg.group(this.getDefaultValues(this.activeObject));
      } else {
        this.form.reset(this.getDefaultValues(this.activeObject));
      }

      this.formCollapsed = !!this.activeObject.shadow;

      this.formSubscription = this.form.valueChanges.subscribe(form => {
        const shadow = new fabric.Shadow();
        shadow.color = form.color + ObjectShadowComponent.calcTransparencyInHex(form.opacity);
        shadow.offsetX = form.offsetX;
        shadow.offsetY = form.offsetY;
        shadow.blur = form.blur;
        this.activeObject.set('shadow', shadow);
        this.render();
      });
    }
  }

  ngOnDestroy(): void {
    this.formSubscription.unsubscribe();
  }

  resetProperties() {
    this.activeObject.set('shadow', undefined);
    this.render();
  }

  getDefaultValues(activeObject: CustomObject | null): any {
    if (activeObject?.shadow) {
      const shadow = activeObject.shadow as Shadow; // TODO: not allowed cast
      return {
        color: [shadow.color?.slice(0, -2)],
        offsetX: [shadow.offsetX],
        offsetY: [shadow.offsetY],
        blur: [shadow.blur],
        opacity: [0.5] // TODO: calculate from color
      };
    }

    return {
      color: ['#C2C2C2'],
      offsetX: ['45'],
      offsetY: ['45'],
      blur: ['5'],
      opacity: [0.5]
    };
  }

  render() {
    this.activeObject.canvas?.renderAll();
  }

  private static calcTransparencyInHex(opacityNumber: number) {
    const alpha = Math.round(opacityNumber * 255);
    return (alpha + 0x10000).toString(16).substr(-2).toUpperCase();
  }
}
