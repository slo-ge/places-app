import {BaseResolver, ResolverType} from "@app/core/editor/resolvers/base.resolver";
import {CustomTextBox} from "@app/core/editor/fabric-object.utils";
import {Font, PresetObject} from "@app/core/model/preset";
import {importFontInDom} from "@app/core/editor/utils";
import * as FontFaceObserver from 'fontfaceobserver'

export class FontResolver implements BaseResolver {
  readonly resolverType: ResolverType = ResolverType.TEXT;

  applyOnObject(object:  CustomTextBox , preset: PresetObject): void {
    if (preset.font) {
      // this only adds the font as a presetFont field to the object
      // `loadFontFromPresetItem` does set the font
      object.presetFont = preset.font;
    }
  }

  applyOnPreset(object: CustomTextBox , preset: PresetObject): void {
    if (object.presetFont) {
      preset.font = object.presetFont;
    }
  }

  /**
   * Asynchronously load the font
   */
  static async loadFontFromPresetItem(font: Font, fabricText: CustomTextBox) {
    const fontObserver = new FontFaceObserver(font.fontName);
    importFontInDom(font);
    await fontObserver.load(font.fontFamily, 5000).then(
      () => fabricText.set('fontFamily', font?.fontFamily), // The font can only be set, if it is already loaded
      (e: any) => console.error(e)
    );
  }
}

export class FontMiscResolver implements BaseResolver {
  readonly resolverType: ResolverType = ResolverType.TEXT;

  applyOnObject(object:  CustomTextBox , preset: PresetObject): void {
    if (preset.fontWeight) {
      object.set('fontWeight', preset.fontWeight);
    }

    if (preset.fontLineHeight) {
      object.set('lineHeight', Number(preset.fontLineHeight));
    }

    if (preset.fontLetterSpacing) {
      object.set('charSpacing', Number(preset.fontLetterSpacing));
    }

    if (preset.fontColor) {
      object.set('fill', preset.fontColor);
    }

    if (preset.fontUnderline) {
      object.underline = true;
    }

    if (preset.fontBackgroundColor) {
      object.backgroundColor = preset.fontBackgroundColor;

      if (preset.fontBackgroundPadding) {
        object.padding = preset.fontBackgroundPadding;
      }
    }
  }

  applyOnPreset(object: CustomTextBox , preset: PresetObject): void {
    if (object.fontSize) {
      preset.fontSize = Math.round(object.fontSize || 0);
    }

    if (object.fill) {
      preset.fontColor = object.fill as string;
    }

    if (object.fontWeight) {
      preset.fontWeight = object.fontWeight;
    }
    if (object.lineHeight) {
      preset.fontLineHeight = object.lineHeight;
    }

    if (object.charSpacing) {
      preset.fontLetterSpacing = object.charSpacing;
    }

    if (object.underline) {
      preset.fontUnderline = object.underline;
    } else {
      preset.fontUnderline = false;
    }

    if (object.backgroundColor) {
      preset.fontBackgroundColor = object.backgroundColor;
    } else {
      preset.fontBackgroundColor = null;
    }

    if (object.padding) {
      preset.fontBackgroundPadding = object.padding;
    }
  }
}
