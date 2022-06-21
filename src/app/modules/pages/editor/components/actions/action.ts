import {CustomImageBox, CustomObject, CustomTextBox} from "@app/core/editor/fabric-object.utils";
import {Injectable} from "@angular/core";
import {FormGroup} from "@angular/forms";

export type  ActiveObjectType = CustomObject | CustomImageBox | CustomTextBox;

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

export interface FormAction {
  form: FormGroup;
  resetProperties(): void;
  initialFormValues(): FormGroup;
}
