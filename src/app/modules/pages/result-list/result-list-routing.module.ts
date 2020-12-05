import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ResultListComponent} from "@app/modules/pages/result-list/result-list.component";

const routes: Routes = [{path: '', component: ResultListComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResultListRoutingModule {
}
