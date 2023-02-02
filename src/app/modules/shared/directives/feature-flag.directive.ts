import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { InitialConfigService } from '@app/core/services/initial-config.service';
import { FeatureFlags } from '@shared-lib/config';

@Directive({
    selector: '[ifFeatureFlag]'
})
export class FeatureFlagDirective implements OnInit {
    @Input()
    ifFeatureFlag!: FeatureFlags;
    @Input()
    ifFeatureFlagElse?: TemplateRef<unknown>;

    constructor(private templateRef: TemplateRef<unknown>,
                private viewContainerRef: ViewContainerRef,
                private initialConfig: InitialConfigService) {
    }

    ngOnInit() {
        const featureFlag = this.initialConfig.getFeatures().includes(this.ifFeatureFlag);
        featureFlag ? this.onIf() : this.onElse();
    }

    private onIf(): void {
        this.createView(this.templateRef);
    }

    private onElse(): void {
        if (!this.ifFeatureFlagElse) {
            return;
        }
        this.createView(this.ifFeatureFlagElse);
    }

    private createView(templateRef: TemplateRef<unknown>): void {
        this.viewContainerRef.createEmbeddedView(templateRef);
    }
}
