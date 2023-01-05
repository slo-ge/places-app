import {BaseResolver, ResolverType} from '@app/core/editor/resolvers/base.resolver';
import {CustomObject} from '@app/core/editor/fabric-object.utils';
import {PresetObject} from '@app/core/model/preset';

export class ObjectOpacityResolver implements BaseResolver {
  readonly resolverType = ResolverType.OBJECT;

  applyOnObject(object: CustomObject, preset: PresetObject): void {
    if (preset.opacity) {
      object.set('opacity', preset.opacity);
    }
  }

  applyOnPreset(object: CustomObject, preset: PresetObject): void {
    if (object.opacity) {
      preset.opacity = object.opacity;
    }
  }
}
