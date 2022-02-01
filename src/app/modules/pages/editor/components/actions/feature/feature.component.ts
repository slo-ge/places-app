import {Component, Input} from '@angular/core';
import {FeatureFlag, FeatureService} from "@app/core/services/feature.service";
import {Canvas} from "fabric/fabric-impl";

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

  constructor(private featureService: FeatureService) { }

  enable(feature: FeatureFlag): void {
    this.enabled = this.featureService.enableCanvasFeature(feature, this.canvas);
  }
}
