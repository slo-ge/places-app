import {Injectable} from '@angular/core';
import {SimpleLocalCacheService} from "@app/core/services/simple-local-cache.service";
import {OverlayService} from "@app/modules/overlay/overlay.service";
import {FeedbackComponent} from "@app/modules/shared/components/feedback/feedback.component";

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private localStorage: SimpleLocalCacheService,
              private overlayService: OverlayService) {
  }

  /**
   * Modal will only be opened if it was not opened before
   */
  openAtFirstTime(): void {
    if (!this.localStorage.getFeedbackClosed()) {
      setTimeout(() => this.overlayService.open(FeedbackComponent), 1000);
      this.localStorage.setFeedbackClosed();
    }
  }
}
