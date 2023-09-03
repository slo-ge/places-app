import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { Canvas } from 'fabric/fabric-impl';
import { Preset } from '@app/core/model/preset';
import { map } from 'rxjs/operators';

interface CanvasAndPreset {
    canvas: Canvas;
    preset: Preset;
}

@Injectable({
    providedIn: 'root',
})
export class EditorService {
    private canvasAndPreset$: ReplaySubject<CanvasAndPreset> = new ReplaySubject(1);
    private currentCanvas: Canvas | null = null;

    constructor() {}

    setCanvas(canvas: Canvas, preset: Preset) {
        if (this.currentCanvas !== null) {
            EditorService.removeListener(this.currentCanvas);
            this.currentCanvas.clear();
        }

        this.canvasAndPreset$.next({ canvas, preset });
        this.currentCanvas = canvas;
    }

    getCanvas(): Observable<Canvas> {
        return this.canvasAndPreset$.pipe(map(d => d.canvas));
    }

    getCurrentCanvasAndPreset(): Observable<CanvasAndPreset> {
        return this.canvasAndPreset$.asObservable();
    }

    /**
     * On canvas change we do remove all eventListeners on old canvas
     *
     * @param canvas
     * @private
     */
    private static removeListener(canvas: Canvas) {
        canvas.clear();
        (canvas as any).__eventListeners = {};
    }
}
