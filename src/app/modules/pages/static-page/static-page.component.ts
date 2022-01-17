import {Component, OnInit} from '@angular/core';
import {CmsService} from "@app/core/services/cms.service";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-result-list',
  templateUrl: './static-page.component.html',
  styleUrls: ['./static-page.component.scss']
})
export class StaticPageComponent implements OnInit {

  imprintText$!: Observable<string>;

  constructor(private cmsService: CmsService ) {
  }

  ngOnInit(): void {
    this.imprintText$ = this.cmsService.getSettings().pipe(map(value => value.Imprint));

  }
}
