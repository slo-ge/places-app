import {Subject} from 'rxjs';
import {OverlayRef} from '@angular/cdk/overlay';
import {TemplateRef, Type} from '@angular/core';

export interface OverlayCloseEvent<R> {
  type: 'backdropClick' | 'close';
  data: R;
}

// R = Response Data Type, T = Data passed to Modal Type
export class CustomOverlayRef<R = any, T = any> {
  afterClosed$ = new Subject<OverlayCloseEvent<R | null>>();

  constructor(
    public overlay: OverlayRef,
    public content: string | TemplateRef<any> | Type<any>,
    public data: T | null // pass data to modal i.e. FormData
  ) {
    overlay.backdropClick().subscribe(() => this._close('backdropClick', null));
  }

  close(data?: R) {
    // @ts-ignore
    this._close('close', data);
  }

  private _close(type: 'backdropClick' | 'close', data: R | null) {
    this.overlay.dispose();
    this.afterClosed$.next({
      type,
      data
    });

    this.afterClosed$.complete();
  }
}
