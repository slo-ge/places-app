import {Component, HostListener} from '@angular/core';
import {CustomObject} from "@app/core/editor/fabric-object.utils";
import {copyPasteKeyPress, paste} from "@app/modules/pages/editor/utils/copy-paste";
import {faCopy} from "@fortawesome/free-solid-svg-icons/faCopy";
import {ActiveObjectService, ObjectAction} from "@app/modules/pages/editor/components/actions/action";

@Component({
  selector: 'app-object-copy',
  templateUrl: './object-copy.component.html'
})
export class ObjectCopyComponent extends ObjectAction<CustomObject> {
  @HostListener('document:keydown', ['$event'])
  onKeyPress($event: KeyboardEvent) {
    copyPasteKeyPress($event, this.activeObject, this.activeObject.canvas!);
  }

  faIcon = faCopy;

  constructor(activeObjectService: ActiveObjectService) {
    super(activeObjectService);
  }

  copy() {
    this.activeObject?.clone((obj: CustomObject) => {
      if (this.activeObject.canvas) {
        paste(this.activeObject.canvas, obj);
      } else {
        console.error('No active canvas found on copying action');
      }
    });
  }
}
