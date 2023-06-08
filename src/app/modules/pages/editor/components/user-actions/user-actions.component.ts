import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { getPresetItem } from '@app/core/editor/fabric-object.utils';
import { toAbsoluteCMSUrl } from '@app/core/editor/utils';
import { Preset, PresetObject } from '@app/core/model/preset';
import { CmsService } from '@app/core/services/cms.service';
import { CustomOverlayRef } from '@app/modules/overlay/custom-overlay-ref';
import { OverlayService } from '@app/modules/overlay/overlay.service';
import { faPaste, faSave, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { Canvas } from 'fabric/fabric-impl';
import { take } from 'rxjs';

@Component({
    selector: 'app-user-actions',
    templateUrl: './user-actions.component.html',
    styleUrls: ['./user-actions.component.scss'],
})
export class UserActionsComponent {
    @Input({ required: true }) preset!: Preset;
    @Input({ required: true }) canvas!: Canvas;
    @ViewChild('deleteConformation') deleteConformation?: TemplateRef<HTMLDivElement>;
    private deleteConformationRef?: CustomOverlayRef;

    readonly saveChangesIcon = faSave;
    readonly duplicateIcon = faPaste;
    readonly deleteIcon = faTrashCan;
    readonly toCmsUrl = toAbsoluteCMSUrl;

    sentUpdateResponse: string | null = '';

    constructor(private cmsService: CmsService, private router: Router, private overlay: OverlayService) {}

    /**
     * Update the template in CMS
     */
    updateValues(defaults?: PresetObject[] | null) {
        defaults = defaults || getPresetItem(this.canvas);

        if (!defaults) {
            return;
        }

        this.cmsService
            .updatePreset(defaults, this.preset.id)
            .pipe(take(1))
            .subscribe({
                next: res => (this.sentUpdateResponse = `updated at: ${res.updated_at?.toString() || null}`),
                error: err => (this.sentUpdateResponse = err.message),
            });
    }

    /**
     * Duplicate preset
     */
    async duplicate() {
        const preset = await this.cmsService.duplicatePreset(this.preset.id);
        this.reloadBrowserWith(preset.id);
    }

    /**
     * Delete preset
     */
    async delete() {
        void this.cmsService.deletePreset(this.preset.id);
        this.deleteConformationRef?.close();
        this.reloadBrowserWith('');
    }

    openDelete() {
        this.deleteConformationRef = this.overlay.open(this.deleteConformation!);
    }

    private reloadBrowserWith(presetId: number | '') {
        this.router
            .navigate(['editor'], {
                queryParams: { presetId },
                queryParamsHandling: 'merge',
            })
            .then(() => location.reload());
    }
}
