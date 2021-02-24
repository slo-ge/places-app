import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DefaultLayoutComponent} from "@app/modules/page-layouts/default-layout/default-layout.component";

const routes: Routes = [
  {
    path: '',
    component: DefaultLayoutComponent,
    loadChildren: () => import('./modules/pages/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'result-list',
    component: DefaultLayoutComponent,
    loadChildren: () => import('./modules/pages/result-list/result-list.module').then(m => m.ResultListModule)
  },
  {
    path: 'editor',
    component: DefaultLayoutComponent,
    loadChildren: () => import('./modules/pages/editor/editor.module').then(m => m.EditorModule)
  },
  {
    path: 'render',
    loadChildren: () => import('./modules/pages/render/render.module').then(m => m.RenderModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
