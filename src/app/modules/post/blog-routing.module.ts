import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PostComponent} from "./post/post.component";
import {FooterComponent} from "./footer/footer.component";

const routes: Routes = [
    {path: ':id', component: PostComponent},
    {path: '', component: PostComponent},
    {
        path: '',
        component: FooterComponent,
        outlet: 'sticky-footer'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BlogRoutingModule {
}
