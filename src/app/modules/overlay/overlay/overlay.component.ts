import { Component, OnInit, TemplateRef, Type } from '@angular/core';
import {CustomOverlayRef} from "@app/modules/overlay/custom-overlay-ref";
import {faWindowClose} from "@fortawesome/free-solid-svg-icons";


@Component({
  selector: 'app-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.scss']
})
export class OverlayComponent implements OnInit {
  contentType: 'template' | 'string' | 'component' | null = null;
  content: string | TemplateRef<any> | Type<any> |  null  | any = null;
  context: any = null;
  faClose = faWindowClose;
  constructor(private ref: CustomOverlayRef) {}

  close() {
    this.ref.close(null);
  }

  ngOnInit() {
    this.content = this.ref.content;

    if (typeof this.content === 'string') {
      this.contentType = 'string';
    } else if (this.content instanceof TemplateRef) {
      this.contentType = 'template';
      this.context = {
        close: this.ref.close.bind(this.ref)
      };
    } else {
      this.contentType = 'component';
    }
  }
}
