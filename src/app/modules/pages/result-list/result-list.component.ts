import { Component, OnInit } from '@angular/core';
import {WordpressContentService} from "@app/core/services/wordpress-content.service";
import {EMPTY, Observable} from "rxjs";
import {Post} from "@app/core/model/wpObject";

@Component({
  selector: 'app-result-list',
  templateUrl: './result-list.component.html',
  styleUrls: ['./result-list.component.scss']
})
export class ResultListComponent implements OnInit {
  posts$: Observable<Post[]> = EMPTY;

  constructor(private wordpressService: WordpressContentService) { }

  ngOnInit(): void {
    this.posts$ = this.wordpressService.getPosts();
  }
}
