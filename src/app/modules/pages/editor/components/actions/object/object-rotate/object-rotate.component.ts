import {Component} from '@angular/core';
import {ActiveObjectService, ObjectAction} from "@app/modules/pages/editor/components/actions/action";
import {CustomObject} from "@app/core/editor/fabric-object.utils";
import {faSync} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-object-rotate',
  templateUrl: './object-rotate.component.html'
})
export class ObjectRotateComponent extends ObjectAction<CustomObject> {
  iconRotate = faSync;


  constructor(activeObjectService: ActiveObjectService) {
    super(activeObjectService);
  }

  turn90() {
    if (this.activeObject !== undefined) {
      this.activeObject.centeredRotation = true;
      this.activeObject.rotate(this.activeObject.angle! + 90);
      this.activeObject.canvas?.renderAll();
    }
  }
}
