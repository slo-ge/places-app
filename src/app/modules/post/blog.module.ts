import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PostComponent} from './post/post.component';
import {BlogRoutingModule} from "./blog-routing.module";
import {SharedModule} from "../../shared/shared.module";
import {FooterComponent} from './footer/footer.component';

@NgModule({
  declarations: [PostComponent, FooterComponent],
  imports: [
    CommonModule,
    BlogRoutingModule,
    SharedModule
  ]
})
export class BlogModule {
}
