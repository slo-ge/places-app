import {Component, Input} from '@angular/core';
import {FeatureFlag, FeatureService} from "@app/core/services/feature.service";
import {Canvas} from "fabric/fabric-impl";
import {faToggleOn} from "@fortawesome/free-solid-svg-icons/faToggleOn";
import {faToggleOff} from "@fortawesome/free-solid-svg-icons/faToggleOff";

@Component({
  selector: 'app-feature',
  templateUrl: './feature.component.html',
  styleUrls: ['./feature.component.scss']
})
export class FeatureComponent {
  @Input()
  canvas!: Canvas;

  FeatureFlag = FeatureFlag;
  enabled: FeatureFlag[] = [];

  faToggleOn = faToggleOn;
  faToggleOff = faToggleOff;

  constructor(private featureService: FeatureService) { }

  enable(feature: FeatureFlag): void {
    this.enabled = this.featureService.enableCanvasFeature(feature, this.canvas);
  }
}
