import {CustomImageBox, CustomObject, CustomTextBox} from "@app/core/editor/fabric-object.utils";
import {Injectable} from "@angular/core";

export type  ActiveObjectType = CustomObject | CustomImageBox | CustomTextBox; // can be many more ... for example fabric.Group

export abstract class ObjectAction<T extends ActiveObjectType> {
  protected constructor(private activeObjectService: ActiveObjectService) {
  }

  get activeObject(): T {
    return this.activeObjectService.getActiveObject() as T;
  }

  public render() {
    this.activeObject.canvas?.renderAll();
  }
}

@Injectable()
export abstract class ActiveObjectService {
  public abstract getActiveObject(): ActiveObjectType;
}
