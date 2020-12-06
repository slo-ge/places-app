import { Component, OnInit } from '@angular/core';
import {WordpressContentService} from "@app/core/services/wordpress-content.service";
import {EMPTY, Observable} from "rxjs";
import {Post} from "@app/core/model/wpObject";
import {ActivatedRoute} from "@angular/router";

//export const BASE_URL = 'https://www.les-nouveaux-riches.com/wp-json/wp/v2';
// WORDPRESSPOST_FIX = /wp-json/wp/v2
export const BASE_URL = '/assets/posts';

const PLACEHOLDER_URL = BASE_URL;
@Component({
  selector: 'app-result-list',
  templateUrl: './result-list.component.html',
  styleUrls: ['./result-list.component.scss']
})
export class ResultListComponent implements OnInit {
  posts$: Observable<Post[]> = EMPTY;

  constructor(private wordpressService: WordpressContentService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    const apiUrl = this.route.snapshot.queryParamMap.get('apiUrl') || PLACEHOLDER_URL;
    this.posts$ = this.wordpressService.getPosts(apiUrl);
  }
}
