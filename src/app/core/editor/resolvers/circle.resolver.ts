import {BaseResolver, ResolverType} from "@app/core/editor/resolvers/base.resolver";
import {CustomCircleObject} from "@app/core/editor/fabric-object.utils";
import {PresetObjectCircle} from "@app/core/model/preset";

export class CircleResolver implements BaseResolver {
  readonly resolverType: ResolverType = ResolverType.CIRCLE;

  applyOnObject(object: CustomCircleObject, preset: PresetObjectCircle): void {
    if (preset.fill) {
      object.set('fill', preset.fill);
    }

    if (preset.radius) {
      object.set('radius', preset.radius);
    }

  }

  applyOnPreset(object: CustomCircleObject, preset: PresetObjectCircle): void {
    if (object.fill) {
      preset.fill = object.fill as string;
    }

    if (object.radius) {
      preset.radius = object.radius * object.scaleX!;
    }
  }
}
