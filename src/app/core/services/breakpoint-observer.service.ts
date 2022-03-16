import {Injectable} from '@angular/core';
import {fromEvent, Observable} from 'rxjs';
import {distinctUntilChanged, map, shareReplay, startWith} from 'rxjs/operators';

export enum Breakpoint {
  XL, LG, MD, SM, XS, NEVER
}

const QUERY: Map<Breakpoint, string> = new Map([
  [Breakpoint.XL, '(min-width: 1200px)'],
  [Breakpoint.LG, '(min-width: 992px)'],
  [Breakpoint.MD, '(min-width: 768px)'],
  [Breakpoint.SM, '(min-width: 576px)'],
  [Breakpoint.XS, '(min-width: 0px)'],
]);

@Injectable({
  providedIn: 'root'
})
export class BreakpointObserverService {
  private readonly _size$: Observable<Breakpoint>;

  constructor() {
    this._size$ = fromEvent(window, 'resize').pipe(
      startWith(this._getScreenSize()),
      map(_b => {
        return this._getScreenSize();
      }),
      distinctUntilChanged(),
      shareReplay({bufferSize: 1, refCount: true})
    );
  }

  public getSize(): Observable<Breakpoint> {
    return this._size$;
  }

  private _getScreenSize(): Breakpoint {
    const [[newSize = Breakpoint.NEVER]] = Array.from(QUERY.entries()).filter(
      ([_size, mediaQuery]) => window.matchMedia(mediaQuery).matches
    );
    return newSize;
  }
}
