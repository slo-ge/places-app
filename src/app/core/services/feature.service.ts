import { Injectable } from '@angular/core';
import { InitialConfigService } from '@app/core/services/initial-config.service';
import { FeatureFlags } from '@shared-lib/config';

@Injectable({
  providedIn: 'root'
})
export class FeatureService {

  constructor(private initialConfigService: InitialConfigService) { }

  public isTrackingEnabled() {
    return this.featureEnabled(FeatureFlags.ENABLE_TRACKING);
  }

  private featureEnabled(featureFlag: FeatureFlags) {
    return this.initialConfigService.getFeatures().includes(featureFlag);
  }
}
