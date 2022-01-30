import {Component, OnInit} from '@angular/core';
import {CmsService, Tag} from "@app/core/services/cms.service";
import {Observable} from "rxjs";
import {ActivatedRoute, Router, RouterLinkActive} from "@angular/router";
import {faWindowClose} from "@fortawesome/free-solid-svg-icons/faWindowClose";
import {faAngleLeft} from "@fortawesome/free-solid-svg-icons/faAngleLeft";
import {faAngleRight} from "@fortawesome/free-solid-svg-icons/faAngleRight";

@Component({
  selector: 'app-preset-tags',
  templateUrl: './preset-tags.component.html',
  styleUrls: ['./preset-tags.component.scss']
})
export class PresetTagsComponent implements OnInit {
  tags$: Observable<Tag[]> | null = null;

  faClose = faWindowClose;
  faArrowLeft = faAngleLeft;
  faArrowRight = faAngleRight;

  constructor(private cmsService: CmsService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit(): void {
    this.tags$ = this.cmsService.getPresetTags();
  }

  /**
   * Only remove current tag form query param, if the presetTag is set.
   * TODO: handle query params globally
   *
   * @param rla RouterLinkActive
   */
  remove(rla: RouterLinkActive) {
    if (rla.isActive) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {presetTag: null},
        queryParamsHandling: 'merge'
      });
    }
  }

  scroll(container: HTMLDivElement, position: 'left' | 'right' = 'right') {
    const directionX = container.scrollLeft  + (position === 'right' ? 150 : -150);
    container.scrollTo({left: directionX, behavior: 'smooth'});
  }
}
