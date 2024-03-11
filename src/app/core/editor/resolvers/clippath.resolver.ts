import { BaseResolver, ResolverType } from "@app/core/editor/resolvers/base.resolver";
import { CustomImageBox } from "@app/core/editor/fabric-object.utils";
import { PresetObject } from "@app/core/model/preset";
import { fabric } from "fabric";
import {
  applyMaskWithCorrectScales
} from "@app/modules/pages/editor/components/actions/object/object-mask/object-mask.component";


export class ClipPathResolver implements BaseResolver {
  readonly resolverType: ResolverType = ResolverType.OBJECT;

  applyOnObject(object: CustomImageBox, preset: PresetObject): void {
    if(preset.clipPath) {
      let mask;
      if (preset.clipPath.type === "circle") {
        mask = new fabric.Circle({...preset.clipPath});
      } else {
        mask = new fabric.Rect({...preset.clipPath});
      }
      object.clipPath = applyMaskWithCorrectScales(object, mask);
      object.clipPath.inverted = preset.clipPath.inverted;
      object.__internalClipPath = preset.clipPath;
    }
  }

  applyOnPreset(object: CustomImageBox, preset: PresetObject): void {
    // TODO: There is a bug, on rescaling the image box the clipPath needs to be
    //       newly calculated as well
    if (object.__internalClipPath) {
      preset.clipPath = object.__internalClipPath;
    }
  }
}