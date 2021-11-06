import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {faAlignLeft} from "@fortawesome/free-solid-svg-icons/faAlignLeft";
import {faAlignRight} from "@fortawesome/free-solid-svg-icons/faAlignRight";
import {faAlignCenter} from "@fortawesome/free-solid-svg-icons/faAlignCenter";
import {faAlignJustify} from "@fortawesome/free-solid-svg-icons/faAlignJustify";
import {IconDefinition} from "@fortawesome/fontawesome-common-types";
import {KeyValue} from "@angular/common";
import {CustomTextBox} from "@app/core/editor/fabric-object.utils";

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
export class TextAlignComponent implements OnChanges {
  @Input()
  textBox!: CustomTextBox;

  currentAlign: TextAlignment = TextAlignment.LEFT;

  originalOrder = (_a: KeyValue<TextAlignment,IconDefinition>, _b: KeyValue<TextAlignment,IconDefinition>): number => {
    return 0;
  }

  positions: Map<TextAlignment, IconDefinition> = new Map([
    [TextAlignment.LEFT, faAlignLeft],
    [TextAlignment.RIGHT, faAlignRight],
    [TextAlignment.CENTER, faAlignCenter],
    [TextAlignment.JUSTIFY, faAlignJustify],
  ]);

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    this.currentAlign = this.textBox.textAlign as TextAlignment;
  }

  changeTextAlign(position: TextAlignment) {
    this.currentAlign = position;
    this.textBox.set('textAlign', position);
    this.textBox.canvas!.renderAll();
  }
}
