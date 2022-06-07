import { BaseResolver, ResolverType } from '@app/core/editor/resolvers/base.resolver';
import { CustomObject } from '@app/core/editor/fabric-object.utils';
import { PresetObject } from '@app/core/model/preset';

export class StrokeResolver implements BaseResolver {
    readonly resolverType = ResolverType.OBJECT;

    applyOnObject(object: CustomObject, preset: PresetObject): void {
        console.log(preset);
        if (preset.stroke) {
            object.set('stroke', preset.stroke.stroke);
            object.set('strokeWidth', preset.stroke.strokeWidth);
            object.set('strokeUniform', preset.stroke.strokeUniform);
        }
    }

    applyOnPreset(object: CustomObject, preset: PresetObject): void {
        if (object.stroke) {
            preset.stroke = {
                strokeWidth: object.strokeWidth!,
                stroke: object.stroke,
                strokeUniform: object.strokeUniform!
            }
        }
    }
}
