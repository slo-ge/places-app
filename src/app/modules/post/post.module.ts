import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PostComponent} from './post/post.component';
import {PostRoutingModule} from "./post-routing.module";
import {SearchModule} from "../search/search.module";


@NgModule({
  declarations: [PostComponent],
  imports: [
    CommonModule,
    PostRoutingModule,
    SearchModule
  ]
})
export class PostModule {
}
