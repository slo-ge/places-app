import {Component} from '@angular/core';
import {faSync} from "@fortawesome/free-solid-svg-icons";
import {CustomOverlayRef} from "@app/modules/overlay/custom-overlay-ref";


@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent {
  faRefresh = faSync;

  constructor(private overlay: CustomOverlayRef) {
  }

  close() {
    this.overlay.close();
  }
}
