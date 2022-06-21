import { BaseResolver, ResolverType } from '@app/core/editor/resolvers/base.resolver';
import { CustomObject } from '@app/core/editor/fabric-object.utils';
import { PresetObject } from '@app/core/model/preset';
import {Shadow} from "fabric/fabric-impl";

export class ObjectShadowResolver implements BaseResolver {
    readonly resolverType = ResolverType.OBJECT;

    applyOnObject(object: CustomObject, preset: PresetObject): void {
        if (preset.shadow) {
            object.set('shadow', preset.shadow as Shadow);
        }
    }

    applyOnPreset(object: CustomObject, preset: PresetObject): void {
        if (object.shadow) {
          preset.shadow = object.shadow as Shadow;
        }
    }
}
