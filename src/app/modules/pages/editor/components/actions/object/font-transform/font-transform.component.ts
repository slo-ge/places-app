import { Component } from '@angular/core';
import { ActiveObjectService, ObjectAction } from '@app/modules/pages/editor/components/actions/action';
import { CustomTextBox } from '@app/core/editor/fabric-object.utils';
import { faArrowDown, faArrowUp, faFont, faRemove } from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';

@Component({
    selector: 'app-font-transform',
    templateUrl: './font-transform.component.html',
    styleUrls: ['./font-transform.component.scss']
})
export class FontTransformComponent extends ObjectAction<CustomTextBox> {
    readonly faCase = faFont;

    currentCase?: 'uppercase' | 'lowercase';
    currentIcon: IconDefinition = faArrowUp;

    constructor(activeObjectService: ActiveObjectService) {
        super(activeObjectService);
        this.currentCase = this.activeObject.presetFontTransform;
        this._setIcon();
    }


    nextCase() {
        if (!this.currentCase) {
            this.currentCase = 'uppercase';
            this.activeObject.text = this.activeObject.text?.toUpperCase();
        } else if (this.currentCase === 'uppercase') {
            this.currentCase = 'lowercase';
            this.activeObject.text = this.activeObject.text?.toLowerCase();
        } else {
            this.currentCase = undefined;
        }
        this._setIcon();
        this.activeObject.presetFontTransform = this.currentCase;
        this.activeObject.canvas?.renderAll();
    }

    private _setIcon() {
        if (this.currentCase === undefined) {
            this.currentIcon = faArrowUp;
        } else if (this.currentCase === 'lowercase') {
            this.currentIcon = faRemove;
        } else {
            this.currentIcon = faArrowDown;
        }
    }
}
