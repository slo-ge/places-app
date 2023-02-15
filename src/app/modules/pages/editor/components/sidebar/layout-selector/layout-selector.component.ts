import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CmsService } from "@app/core/services/cms.service";
import { combineLatest, EMPTY, Observable, of } from "rxjs";
import { Preset } from "@app/core/model/preset";
import { toAbsoluteCMSUrl } from "@app/core/editor/utils";
import { ActivatedRoute } from "@angular/router";
import { distinctUntilChanged, map, mergeMap, tap } from "rxjs/operators";
import { faVideo } from "@fortawesome/free-solid-svg-icons";
import { SeoService } from "@app/core/seo/seo.service";
import { FeatureFlags } from '@shared-lib/config';
import { CmsAuthService } from '@app/core/services/cms-auth.service';

@Component({
    selector: 'app-layout-selector',
    templateUrl: './layout-selector.component.html',
    styleUrls: ['./layout-selector.component.scss']
})
export class LayoutSelectorComponent implements OnInit {
    @Output()
    layout = new EventEmitter<Preset>();

    readonly previewUrls: Map<number, string> = new Map<number, string>();
    readonly faVideo = faVideo;
    readonly FeatureFlags = FeatureFlags;

    presets$: Observable<Preset[]> = EMPTY;

    constructor(private cmsService: CmsService,
                private route: ActivatedRoute,
                private seoService: SeoService,
                private authService: CmsAuthService) {
    }

    ngOnInit(): void {
        const userTemplates$: Observable<Preset[] | null> = this.authService.getUser().pipe(
            map(user => user?.user.isAdmin ? null : user),
            mergeMap(user => (!!user
                ? this.cmsService.getPresets(null, {templatesForUser: user.user.username})
                : of(null)
            ))
        );

        // Get from preset tag or if userPresetOnly param is set, only fetch templates
        // which have a given user, this feature is only available for admin users
        const queryParamTemplates$: Observable<Preset[]> = this.route.queryParamMap.pipe(
            map(param => [param.get('presetTag'), param.get('userPresetsOnly')]),
            tap(([id, _]) => this.seoService.setSeoForPresetTag(Number(id))),
            distinctUntilChanged(),
            mergeMap(([presetTag, userPresetsOnly]) => userPresetsOnly
                ? this.cmsService.getPresets(undefined, {userPresetsOnly: true})
                : this.cmsService.getPresets(presetTag)
            )
        );

        this.presets$ = combineLatest([userTemplates$, queryParamTemplates$]).pipe(
            map(([userTemplates, queryParamTemplates]) => userTemplates || queryParamTemplates),
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
