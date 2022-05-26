import {Component, HostListener, OnInit} from '@angular/core';
import {faTrashAlt} from "@fortawesome/free-solid-svg-icons";
import {ActiveObjectService, ObjectAction} from "@app/modules/pages/editor/components/actions/action";
import {CustomObject} from "@app/core/editor/fabric-object.utils";

@Component({
  selector: 'app-object-remove',
  templateUrl: './object-remove.component.html'
})
export class ObjectRemoveComponent extends ObjectAction<CustomObject & {getObjects: any}> { // TODO: getObjects type not available
  @HostListener('document:keydown.delete', ['$event'])
  keyEventDelete(_event: KeyboardEvent) {
    this.removeActiveObject();
  }

  iconRemove = faTrashAlt;

  constructor(activeObjectService: ActiveObjectService) {
    super(activeObjectService);
  }

  removeActiveObject() {
    const removableObjects = typeof this.activeObject?.getObjects === 'function'
      ? this.activeObject.getObjects()
      : [this.activeObject];

    for (const obj of removableObjects) {
      this.activeObject.canvas!.remove(obj);
    }
  }
}
