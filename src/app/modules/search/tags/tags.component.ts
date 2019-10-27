import { Component, OnInit } from '@angular/core';
import {TaxonomyService} from "../../../core/services/taxonomy.service";
import {Observable} from "rxjs";
import {Tag} from "../../../core/model/tags";

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit {

  constructor(private tagService: TaxonomyService) { }

  tags$: Observable<Tag[]>

  ngOnInit() {
    this.tags$ = this.tagService.getTags();
  }

}
