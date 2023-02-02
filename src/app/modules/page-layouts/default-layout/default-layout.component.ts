import { Component, HostBinding, OnInit } from '@angular/core';
import { OverlayService } from "@app/modules/overlay/overlay.service";
import { FeedbackComponent } from "@app/modules/shared/components/feedback/feedback.component";
import { InitialConfigService } from '@app/core/services/initial-config.service';
import { lastValueFrom } from 'rxjs';
import { ApplicationConfig, FeatureFlags } from '@shared-lib/config';
import { ImprintComponent } from '@app/standalones/imprint/imprint.component';

function getCSSVariables(config: ApplicationConfig) {
  return config.colors
      ? Object.entries(config.colors)
          .map(([key, value]) => `--${key}:${value}`)
          .join(';')
      : '';
}

@Component({
  selector: 'app-default-layout',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss']
})
export class DefaultLayoutComponent implements OnInit{
  appName: string = 'METAMAPPER';
  simpleFooter: boolean = false;
  hideFeedback: boolean = false;
  showImprint: boolean = false;

  @HostBinding('style')
  style = '';

  constructor(private overlay: OverlayService,
              private initialConfig: InitialConfigService,
              private overlayService: OverlayService) {
  }

  openFeedback() {
    this.overlay.open(FeedbackComponent);
  }

  async ngOnInit() {
    const config = await lastValueFrom(this.initialConfig.getConfig());
    this.appName = config.applicationName;
    this.simpleFooter = !!config.featureFlags?.includes(FeatureFlags.SIMPLE_FOOTER);
    this.hideFeedback = !!config.featureFlags?.includes(FeatureFlags.HIDE_FEEDBACK);
    this.showImprint = !!config.featureFlags?.includes(FeatureFlags.SHOW_IMPRINT);
    this.style = getCSSVariables(config);
  }

  openImprint() {
    this.overlayService.open(ImprintComponent);
  }
}
