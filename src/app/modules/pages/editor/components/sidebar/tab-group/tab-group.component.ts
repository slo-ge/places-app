import {
  AfterContentInit,
  Component,
  ContentChildren,
  Input,
  OnChanges,
  QueryList,
  SimpleChanges
} from '@angular/core';
import {TabComponent} from './tab.component';

@Component({
  selector: 'app-tabs',
  template: `
      <div class="nav-tabs">
          <div *ngFor="let tab of tabs" (click)="selectTab(tab)" [class.active]="tab.active" class="nav-item">

                  <div class="item-content">
                      <div *ngIf="tab.faIcon" class="icon">
                          <fa-icon [icon]="tab.faIcon"></fa-icon>
                      </div>
                      {{tab.title}}
                  </div>

          </div>
      </div>
      <ng-content></ng-content>
  `,
  styleUrls: ['./tab-group.component.scss']
})
export class TabGroupComponent implements AfterContentInit, OnChanges {
  @ContentChildren(TabComponent) tabs: any | QueryList<TabComponent>;

  @Input()
  currentIndex?: number;

  ngAfterContentInit() {
    let activeTabs = this.tabs.filter((tab: TabComponent) => tab.active);

    if (activeTabs.length === 0) {
      this.selectTab(this.tabs.first);
    }
  }

  selectTab(tab: TabComponent) {
    this.tabs.toArray().forEach((tab: TabComponent) => tab.active = false);
    tab.active = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    // initially this.tabs is undefined and will only be available in ngAfterContentInit
    if (this.currentIndex !== undefined && this.tabs?.length >= this.currentIndex) {
      this.selectTab(this.tabs.get(this.currentIndex));
    }
  }
}
