import {Overlay, OverlayConfig} from '@angular/cdk/overlay';
import {ComponentPortal, PortalInjector} from '@angular/cdk/portal';
import {Injectable, Injector, TemplateRef, Type} from '@angular/core';
import {OverlayComponent} from "@app/modules/overlay/overlay/overlay.component";
import {CustomOverlayRef} from "@app/modules/overlay/custom-overlay-ref";

@Injectable({
  providedIn: 'root'
})
export class OverlayService {
  constructor(private overlay: Overlay, private injector: Injector) {
  }

  public open<R = any, T = any>(content: string | TemplateRef<any> | Type<any>,
                         data: T | null = null,
                         overlayProperties: Partial<OverlayConfig> = {}): CustomOverlayRef<R> {

    const positionStrategy = this.overlay.position().global().centerHorizontally().centerVertically();
    const configs = new OverlayConfig({
      hasBackdrop: true,
      ...overlayProperties,
      positionStrategy
    });


    const overlayRef = this.overlay.create(configs);
    const customOverlayRef = new CustomOverlayRef<R, T>(overlayRef, content, data);

    const injector = this.createInjector(customOverlayRef, this.injector);
    overlayRef.attach(new ComponentPortal(OverlayComponent, null, injector));
    return customOverlayRef;
  }

  private createInjector(ref: CustomOverlayRef, inj: Injector) {
    const injectorTokens = new WeakMap([[CustomOverlayRef, ref]]);
    return new PortalInjector(inj, injectorTokens);
  }
}
