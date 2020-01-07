import {Injectable, Injector} from '@angular/core';
import {ConnectionPositionPair, Overlay, OverlayConfig, PositionStrategy} from '@angular/cdk/overlay';
import {ComponentPortal, PortalInjector} from '@angular/cdk/portal';
import {PopoverContent, PopoverRef} from './popover-ref';
import {PopoverComponent} from './popover.component';
import {ShareModule} from "@ngx-share/core";

// copy paste from https://netbasal.com/creating-powerful-components-with-angular-cdk-2cef53d81cea
export type PopoverParams<T> = {
    width?: string | number;
    height?: string | number;
    origin: HTMLElement;
    content: PopoverContent;
    data?: T;
}

@Injectable({
    providedIn: ShareModule
})
export class Popover {
    constructor(private overlay: Overlay,
                private injector: Injector) {
    }

    open<T>({origin, content, data, width, height}: PopoverParams<T>): PopoverRef<T> {
        const overlayRef = this.overlay.create(this.getOverlayConfig({origin, width, height}));
        const popoverRef = new PopoverRef<T>(overlayRef, content, data);
        const injector = this.createInjector(popoverRef, this.injector);

        overlayRef.attach(new ComponentPortal(PopoverComponent, null, injector));

        return popoverRef;
    }

    createInjector(popoverRef: PopoverRef, injector: Injector) {
        const tokens = new WeakMap([[PopoverRef, popoverRef]]);
        return new PortalInjector(injector, tokens);
    }

    private getOverlayConfig({origin, width, height}): OverlayConfig {
        return new OverlayConfig({
            hasBackdrop: true,
            width,
            height,
            backdropClass: 'popover-backdrop',
            positionStrategy: this.getOverlayPosition(origin),
            scrollStrategy: this.overlay.scrollStrategies.reposition()
        });
    }

    private getOverlayPosition(origin: HTMLElement): PositionStrategy {
        return this.overlay.position().global().centerHorizontally().centerVertically();
        /*return this.overlay.position()
            .flexibleConnectedTo(origin)
            .withPositions(this.getPositions())
            .withFlexibleDimensions(false)
            .withPush(false);*/
    }


    private getPositions(): ConnectionPositionPair[] {
        return [
            {
                originX: 'center',
                originY: 'top',
                overlayX: 'center',
                overlayY: 'bottom'
            },
            {
                originX: 'center',
                originY: 'bottom',
                overlayX: 'center',
                overlayY: 'top',
            },
        ]
    }

}
