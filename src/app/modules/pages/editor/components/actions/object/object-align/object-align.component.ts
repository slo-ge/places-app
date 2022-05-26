import {Component} from '@angular/core';
import {
  AlignmentService,
  dictToKeys,
  ObjectAlignments,
  SimpleAlignments
} from "@app/modules/pages/editor/components/actions/services/alignment.service";
import {CustomObject} from "@app/core/editor/fabric-object.utils";
import {ObjectPosition} from "@app/core/model/preset";
import {ActiveObjectService, ObjectAction} from "@app/modules/pages/editor/components/actions/action";
import {
  faAlignCenter,
  faCaretSquareLeft,
  faCaretSquareRight,
  faEllipsisV,
  faLayerGroup,
  faSync,
  faTh,
  faTrashAlt
} from "@fortawesome/free-solid-svg-icons";
import {CmsAuthService} from "@app/core/services/cms-auth.service";

@Component({
  selector: 'app-object-align',
  templateUrl: './object-align.component.html',
  styleUrls: ['./object-align.component.scss']
})
export class ObjectAlignComponent extends ObjectAction<CustomObject> {
  activeRangeSliderCurrentValue = 50;
  iconRemove = faTrashAlt;
  iconLeft = faCaretSquareLeft;
  iconRight = faCaretSquareRight;
  iconCenter = faAlignCenter;
  iconRotate = faSync;
  iconLayer = faLayerGroup;
  iconRasta = faTh;
  iconMore = faEllipsisV;

  objectAlignments = dictToKeys(ObjectAlignments);
  simpleAlignments = SimpleAlignments;


  ObjectPosition = ObjectPosition;

  constructor(private alignmentService: AlignmentService,
              public authService: CmsAuthService,
              activeObjectService: ActiveObjectService) {
    super(activeObjectService);
  }

  alignmentAction(aligner: ObjectAlignments | SimpleAlignments) {
    this.alignmentService.move(aligner, this.activeObject.canvas!, this.activeObject);
  }

  moveToBack() {
    const activeObject = this.activeObject;
    const position = this.activeObject.canvas!.getObjects().indexOf(activeObject);

    if (position > 1) {
      this.activeObject.canvas!.moveTo(activeObject, position - 1);
    }
  }

  moveToFront() {
    const activeObject = this.activeObject as any;
    const position = this.activeObject.canvas!.getObjects().indexOf(activeObject);
    this.activeObject.canvas!.moveTo(activeObject, position + 1);
  }

  /**
   * Set a css-like position to the selected object
   * @param position
   */
  position(position: ObjectPosition) {
    const activeObject = this.activeObject as CustomObject;
    activeObject.presetObjectPosition = position;
  }
}
