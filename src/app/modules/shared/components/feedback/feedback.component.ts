import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {faSync} from "@fortawesome/free-solid-svg-icons";
import {CustomOverlayRef} from "@app/modules/overlay/custom-overlay-ref";


@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent {
  simpleTextFeedback = new FormGroup({
    text: new FormControl('', Validators.required),
  });

  faRefresh = faSync;

  constructor(private overlay: CustomOverlayRef) {
  }

  close() {
    this.overlay.close();
  }
}
