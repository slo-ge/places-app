import {Component} from '@angular/core';
import {OverlayService} from "@app/modules/overlay/overlay.service";
import {FeedbackComponent} from "@app/modules/shared/components/feedback/feedback.component";

@Component({
  selector: 'app-default-layout',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss']
})
export class DefaultLayoutComponent {

  constructor(private overlay: OverlayService) {
  }

  openFeedback() {
    this.overlay.open(FeedbackComponent);
  }
}
