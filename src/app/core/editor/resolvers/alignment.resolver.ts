import {BaseResolver, ResolverType} from "@app/core/editor/resolvers/base.resolver";
import {CustomTextBox} from "@app/core/editor/fabric-object.utils";
import {PresetObject} from "@app/core/model/preset";

export class AlignmentResolver implements BaseResolver {
  readonly resolverType: ResolverType = ResolverType.TEXT;

  applyOnObject(object: CustomTextBox, preset: PresetObject): void {
    if(preset.textAlignment) {
      object.set('textAlign', preset.textAlignment);
    }
  }

  applyOnPreset(object: CustomTextBox, preset: PresetObject): void {
    if (object.textAlign) {
      preset.textAlignment = object.textAlign;
    }
  }
}
