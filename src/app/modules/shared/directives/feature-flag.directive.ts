import { ChangeDetectorRef, Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { InitialConfigService } from '@app/core/services/initial-config.service';
import { FeatureFlags } from '@shared-lib/config';
import { Subscription } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

@Directive({
    selector: '[ifFeatureFlag]'
})
export class FeatureFlagDirective implements OnInit, OnDestroy {
    @Input()
    ifFeatureFlag!: FeatureFlags;
    @Input()
    ifFeatureFlagElse?: TemplateRef<unknown>;

    private _viewRef: any = null;
    private _subscriptions = new Subscription();

    constructor(private templateRef: TemplateRef<unknown>,
                private viewContainerRef: ViewContainerRef,
                private initialConfig: InitialConfigService,
                private cdr: ChangeDetectorRef) {
    }

    ngOnInit() {
        this._subscriptions = this.initialConfig.getConfig()
            .pipe(
                map(c => c.featureFlags.includes(this.ifFeatureFlag)),
                distinctUntilChanged()
            )
            .subscribe(enabled => {
                    if (this._viewRef) {
                        this._viewRef = null;
                        this.viewContainerRef.clear();
                        this.cdr.detectChanges();
                    }

                    if (enabled) {
                        this.onIf();
                    } else {
                        this.onElse();
                    }
                }
            );
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
        this._viewRef = this.viewContainerRef.createEmbeddedView(templateRef);
    }

    ngOnDestroy(): void {
        this._subscriptions.unsubscribe();
    }
}
