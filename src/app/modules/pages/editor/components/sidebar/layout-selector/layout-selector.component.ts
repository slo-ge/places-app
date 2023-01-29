import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CmsService } from "@app/core/services/cms.service";
import { EMPTY, Observable } from "rxjs";
import { Preset } from "@app/core/model/preset";
import { toAbsoluteCMSUrl } from "@app/core/editor/utils";
import { ActivatedRoute } from "@angular/router";
import { distinctUntilChanged, map, mergeMap, tap } from "rxjs/operators";
import { faVideo } from "@fortawesome/free-solid-svg-icons";
import { SeoService } from "@app/core/seo/seo.service";
import { FeatureFlags } from '@shared-lib/config';

@Component({
  selector: 'app-layout-selector',
  templateUrl: './layout-selector.component.html',
  styleUrls: ['./layout-selector.component.scss']
})
export class LayoutSelectorComponent implements OnInit {
  @Output()
  layout = new EventEmitter<Preset>();

  settings$: Observable<Preset[]> = EMPTY;

  readonly previewUrls: Map<number, string> = new Map<number, string>();
  readonly faVideo = faVideo;
  readonly FeatureFlags = FeatureFlags;

  constructor(private cmsService: CmsService,
    private route: ActivatedRoute,
    private seoService: SeoService) {
  }

  ngOnInit(): void {
    this.settings$ = this.route.queryParamMap.pipe(
      map(param => param.get('presetTag')),
      tap(id => this.seoService.setSeoForPresetTag(Number(id))),
      distinctUntilChanged(),
      mergeMap(param => this.cmsService.getLayoutSetting(param)),
      tap(presets => {
        // Setting the preview urls and reading them in template
        for (const preset of presets) {
          this.previewUrls.set(preset.id, LayoutSelectorComponent.mapUrl(preset));
        }
      })
    );
  }

  selectPreset(setting: Preset) {
    this.layout.emit(setting);
  }

  cmsApiUrl(url: string) {
    return toAbsoluteCMSUrl(url)
  }

  private static mapUrl(preset: Preset) {
    const forcePreview = !preset.backgroundImage.mime.startsWith('image');
    let url = forcePreview ? null : preset.backgroundImage?.formats?.thumbnail?.url;

    if (preset.preview) {
      url = preset.preview.formats?.thumbnail?.url;
    }

    if (!url) {
      // if it is a video without preview url, then there should be an error loged
      console.error('video preset', preset.id, 'must contain preview image');
      return '';
    }

    return toAbsoluteCMSUrl(url);
  }
}
