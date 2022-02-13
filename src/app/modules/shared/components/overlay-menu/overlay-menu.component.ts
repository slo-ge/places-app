import {Component, ElementRef, HostListener, ViewChild} from '@angular/core';

@Component({
  selector: 'app-overlay-menu',
  templateUrl: './overlay-menu.component.html',
  styleUrls: ['./overlay-menu.component.scss']
})
export class OverlayMenuComponent {
  isOpen = false;

  @ViewChild('content') content!: ElementRef;

  @HostListener('document:mousedown', ['$event'])
  onGlobalClick(event: any): void {

    if (!this.content) {
      return;
    }

    if (!this.content?.nativeElement?.contains(event.target)) {
      this.isOpen = false;
    }
  }

  constructor() {
  }
}
