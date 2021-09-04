import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {GoogleAnalyticsService} from "@app/core/services/google-analytics.service";
import {faSync} from "@fortawesome/free-solid-svg-icons/faSync";

interface SimpleFeedBackItem {
  title: string;
  selected?: boolean;
}

const FEED_BACK_ITEMS: SimpleFeedBackItem[] = [
  {title: 'Thank you'},
  {title: 'I like your tool'},
  {title: 'Go on with some new features'},
  {title: 'It works, but needs to be improved'},
  {title: 'I don\'t understand this tool'},
  {title: 'Fuck off, it does not work'}
];

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent {
  simpleTextFeedback = new FormGroup({
    text: new FormControl('', Validators.required),
  });

  formSent = false;
  fastFeedbackSent = false;

  TRACKING_PREFIX = 'Feedback';
  feedBackItems = FEED_BACK_ITEMS;

  faRefresh = faSync;

  constructor(private trackingService: GoogleAnalyticsService) {
  }

  sendFeedback() {
    this.formSent = true;
    this.trackingService.triggerClick(`${this.TRACKING_PREFIX} ${this.simpleTextFeedback.getRawValue()['text']}`)
    this.simpleTextFeedback.reset();
  }

  highlightSimpleFeedback(feedBackItem: SimpleFeedBackItem) {
    if (!feedBackItem.selected) {
      this.trackingService.triggerClick(`${this.TRACKING_PREFIX}: ${feedBackItem.title}`)
      this.fastFeedbackSent = true;
    }
    if(feedBackItem.selected) {
      this.fastFeedbackSent = false;
    }

    feedBackItem.selected = !feedBackItem.selected;
  }
}
