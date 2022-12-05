import {
  CustomCircleObject, CustomFabricObjects,
  CustomImageBox,
  CustomObject,
  CustomRectObject,
  CustomTextBox
} from "@app/core/editor/fabric-object.utils";
import {PresetObject} from "@app/core/model/preset";

export enum ResolverType {
  TEXT, IMAGE, OBJECT, CIRCLE, RECT
}



export interface BaseResolver {
  readonly resolverType: ResolverType;
  /**
   * Applies preset to fabric custom object
   * @param object
   * @param preset
   */
  applyOnObject(object: CustomFabricObjects, preset: PresetObject): void;

  /**
   * Extracts from object to preset
   * @param object
   * @param preset
   */
  applyOnPreset(object: CustomFabricObjects, preset: PresetObject): void;
}
