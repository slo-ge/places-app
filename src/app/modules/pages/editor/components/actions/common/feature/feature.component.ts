import { Component, Input } from '@angular/core';
import { Canvas } from "fabric/fabric-impl";
import { faToggleOff, faToggleOn } from "@fortawesome/free-solid-svg-icons";
import { initAligningGuidelines } from '@app/core/editor/extensions/init-aligning-guidelines';

export enum Setting {
    SnappingLines
}

@Component({
    selector: 'app-feature',
    templateUrl: './feature.component.html',
    styleUrls: ['./feature.component.scss']
})
export class FeatureComponent {
    @Input()
    canvas!: Canvas;

    faToggleOn = faToggleOn;
    faToggleOff = faToggleOff;

    readonly Setting = Setting;
    settings: Setting[] = []

    toggleSnappingLines() {
        if (this.settings.includes(Setting.SnappingLines)) {
            this.settings = this.settings.filter(item => item !== Setting.SnappingLines);
            return;
        }
        this.settings.push(Setting.SnappingLines);
        initAligningGuidelines(this.canvas);
    }
}
