import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PageComponent} from './page.component';
import {RouterModule, Routes} from "@angular/router";

const routes: Routes = [{path: '', component: PageComponent}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PageRoutingModule {
}


@NgModule({
    declarations: [PageComponent],
    imports: [
        CommonModule, PageRoutingModule
    ]
})
export class PageModule {
}



