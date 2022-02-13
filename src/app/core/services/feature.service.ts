import {Injectable} from '@angular/core';
import {Canvas} from "fabric/fabric-impl";
import {initAligningGuidelines} from "@app/core/editor/extensions/init-aligning-guidelines";

export enum FeatureFlag {
  SNAPPING_LINES
}


@Injectable({
  providedIn: 'root'
})
export class FeatureService {
  constructor() {
  }

  private enabled: FeatureFlag[] = [];

  enableCanvasFeature(feature: FeatureFlag, canvas: Canvas): FeatureFlag[] {
    if (this.enabled.includes(feature)) {
      this.enabled = this.enabled.filter(e => e !== feature);
      return this.enabled;
    }
    this.enabled.push(feature);

    if (feature === FeatureFlag.SNAPPING_LINES) {
      initAligningGuidelines(canvas);
    }

    return this.enabled;
  }
}
