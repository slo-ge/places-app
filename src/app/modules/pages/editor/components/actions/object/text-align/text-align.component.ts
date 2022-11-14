import {Component} from '@angular/core';
import {faAlignCenter, faAlignJustify, faAlignLeft, faAlignRight} from "@fortawesome/free-solid-svg-icons";
import {IconDefinition} from "@fortawesome/fontawesome-common-types";
import {KeyValue} from "@angular/common";
import {CustomTextBox} from "@app/core/editor/fabric-object.utils";
import {ActiveObjectService, ObjectAction} from "@app/modules/pages/editor/components/actions/action";

enum TextAlignment {
  LEFT = 'left',
  RIGHT = 'right',
  CENTER = 'center',
  JUSTIFY = 'justify'
}

@Component({
  selector: 'app-text-align',
  templateUrl: './text-align.component.html',
  styleUrls: ['./text-align.component.scss']
})
export class TextAlignComponent extends ObjectAction<CustomTextBox> {
  currentAlign: TextAlignment = TextAlignment.LEFT;
  positions: Map<TextAlignment, IconDefinition> = new Map([
    [TextAlignment.LEFT, faAlignLeft],
    [TextAlignment.RIGHT, faAlignRight],
    [TextAlignment.CENTER, faAlignCenter],
    [TextAlignment.JUSTIFY, faAlignJustify],
  ]);

  originalOrder = (_a: KeyValue<TextAlignment, IconDefinition>, _b: KeyValue<TextAlignment, IconDefinition>): number => {
    return 0;
  }

  constructor(activeObjectService: ActiveObjectService) {
    super(activeObjectService);
  }

  changeTextAlign(position: TextAlignment) {
    this.currentAlign = position;
    this.activeObject.set('textAlign', position);
    this.activeObject.canvas!.renderAll();
  }
}
