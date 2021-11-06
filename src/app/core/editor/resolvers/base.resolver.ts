import {CustomImageBox, CustomObject, CustomTextBox} from "@app/core/editor/fabric-object.utils";
import {PresetObject} from "@app/core/model/preset";

export enum ResolverType {
  TEXT, IMAGE, OBJECT
}

export interface BaseResolver {
  readonly resolverType: ResolverType;
  /**
   * Applies preset to fabric custom object
   * @param object
   * @param preset
   */
  applyOnObject(object: CustomObject | CustomTextBox | CustomImageBox, preset: PresetObject): void;

  /**
   * Extracts from object to preset
   * @param object
   * @param preset
   */
  applyOnPreset(object: CustomObject | CustomTextBox | CustomImageBox, preset: PresetObject): void;
}
