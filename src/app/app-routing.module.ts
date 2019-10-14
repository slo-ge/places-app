import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';


const routes: Routes = [
    {
        path: 'search',
        loadChildren: () => import('./search/search.module').then(m => m.SearchModule)
    },
    {
        path: 'detail',
        loadChildren: () => import('./detail/detail.module').then(m => m.DetailModule)
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
        scrollOffset: [0, 64] // [x, y]
    })],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
