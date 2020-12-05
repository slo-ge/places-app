import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./modules/pages/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'result-list',
    loadChildren: () => import('./modules/pages/result-list/result-list.module').then(m => m.ResultListModule)
  },
  {
    path: 'editor',
    loadChildren: () => import('./modules/pages/editor/editor.module').then(m => m.EditorModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
