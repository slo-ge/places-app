import {Directive, HostListener, Input} from '@angular/core';
import {GoogleAnalyticsService} from "@app/core/services/google-analytics.service";



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
  public trackingCategory: 'Download' | null = null;

  constructor(private googleAnalytics: GoogleAnalyticsService) {
  }

  @HostListener('click', ['$event']) onClick(_$event: any) {
    if (!this.dataStr) {
      console.error('dataStr must be provided for tracking');
    } else {
      this.googleAnalytics.triggerClick(this.dataStr);

      if(this.trackingCategory) {
          this.googleAnalytics.triggerClick(this.trackingCategory);
      }
    }
  }
}
