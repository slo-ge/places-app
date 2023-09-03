import { Directive, HostListener, Input } from '@angular/core';


@Directive({
    selector: '[trackClick]',
    inputs: [
        'dataStr'
    ]
})
export class TrackDirective {
    @Input('trackClick')
    public dataStr!: string;
    /**
     * If event should have a second track, this input can be used
     * to track an additional parameter
     */
    @Input()
    public trackingCategory: 'Download' | 'Feedback' | null = null;

    constructor() {
    }

    @HostListener('click', ['$event']) onClick(_$event: any) {
        if (!this.dataStr) {
            console.error('dataStr must be provided for tracking');
        } else {
            // TODO: call other tracking service this.googleAnalytics.triggerClick(this.dataStr);
            //       https://github.com/slo-ge/ExportLatest/issues/14
            if (this.trackingCategory) {
                // TODO: call other tracking service this.googleAnalytics.triggerClick(this.trackingCategory);
                //       https://github.com/slo-ge/ExportLatest/issues/14
            }
        }
    }
}
