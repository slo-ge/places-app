import {BaseResolver, ResolverType} from "@app/core/editor/resolvers/base.resolver";
import {CustomRectObject} from "@app/core/editor/fabric-object.utils";
import {PresetObjectRect} from "@app/core/model/preset";

export class RectResolver implements BaseResolver {
  readonly resolverType: ResolverType = ResolverType.RECT;

  applyOnObject(object: CustomRectObject, preset: PresetObjectRect): void {
    if (preset.fill) {
      object.set('fill', preset.fill);
    }
  }

  applyOnPreset(object: CustomRectObject, preset: PresetObjectRect): void {
    if (object.fill) {
      preset.fill = object.fill as string;
    }
  }
}
