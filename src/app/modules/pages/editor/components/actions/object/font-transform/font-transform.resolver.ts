import { BaseResolver, ResolverType } from '@app/core/editor/resolvers/base.resolver';
import { CustomObject, CustomTextBox } from '@app/core/editor/fabric-object.utils';
import { PresetObject } from '@app/core/model/preset';
import { Shadow } from 'fabric/fabric-impl';

export class FontTransformResolver implements BaseResolver {
    readonly resolverType = ResolverType.OBJECT;

    applyOnObject(object:  CustomTextBox, preset: PresetObject): void {
        if (preset.fontTransform === 'uppercase') {
            object.text = object.text?.toUpperCase();
        } else if(preset.fontTransform === 'lowercase') {
            object.text = object.text?.toLowerCase();
        }

        object.presetFontTransform = preset.fontTransform;
    }

    applyOnPreset(object:  CustomTextBox, preset: PresetObject): void {
        preset.fontTransform = object.presetFontTransform;
    }
}
