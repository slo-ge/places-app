import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';


const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule),
    },
    {
        path: 'search',
        loadChildren: () => import('./modules/search/search.module').then(m => m.SearchModule),
        data: {animation: 'Page1'}
    },
    {
        path: 'detail',
        loadChildren: () => import('./modules/detail/detail.module').then(m => m.DetailModule),
        data: {animation: 'Page2'}
    },
    {
        path: 'info',
        loadChildren: () => import('./modules/info/info.module').then(m => m.InfoModule),
        data: {animation: 'Page3'}
    },
    {
        path: 'blog',
        loadChildren: () => import('./modules/post/blog.module').then(m => m.BlogModule),
        data: {animation: 'Page4'}
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
