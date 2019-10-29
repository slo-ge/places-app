import { Component, OnInit } from '@angular/core';
import {TaxonomyService} from "../../core/services/taxonomy.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent{

  constructor(private taxonomyService: TaxonomyService) { }

  tags$ = this.taxonomyService.getTags();

}
