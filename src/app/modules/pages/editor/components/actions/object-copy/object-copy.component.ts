import {Component, Input} from '@angular/core';
import {CustomObject} from "@app/core/editor/fabric-object.utils";
import {paste} from "@app/modules/pages/editor/utils/copy-paste";
import {faCopy} from "@fortawesome/free-solid-svg-icons/faCopy";

@Component({
  selector: 'app-object-copy',
  templateUrl: './object-copy.component.html'
})
export class ObjectCopyComponent  {
  @Input()
  customObject!: CustomObject;

  faIcon = faCopy;

  constructor() { }

  copy() {
      this.customObject?.clone((obj: CustomObject) => {
        if (this.customObject.canvas)  {
          paste(this.customObject.canvas, obj);
        } else {
          console.error('No active canvas found on copying action');
        }
      });
  }
}
