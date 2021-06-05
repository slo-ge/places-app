import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainRoutes} from "./core/utils/routing";

const routes: Routes = [
    {
        path: MainRoutes.HOME,
        loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule),
    },
    {
        path: MainRoutes.PAGE,
        loadChildren: () => import('./modules/page/page.module').then(m => m.PageModule),
    },
    {
        path: MainRoutes.SEARCH,
        loadChildren: () => import('./modules/search/search.module').then(m => m.SearchModule),
        data: {animation: 'Page1'}
    },
    {
        path: MainRoutes.DETAIL,
        loadChildren: () => import('./modules/detail/detail.module').then(m => m.DetailModule),
        data: {animation: 'Page2'}
    },
    {
        path: MainRoutes.INFO,
        loadChildren: () => import('./modules/info/info.module').then(m => m.InfoModule),
        data: {animation: 'Page3'}
    },
    {
        path: MainRoutes.BLOG,
        loadChildren: () => import('./modules/post/blog.module').then(m => m.BlogModule),
        data: {animation: 'Page4'}
    },
    {
        path: MainRoutes.PROFILE,
        loadChildren: () => import('./modules/profile/profile.module').then(m => m.ProfileModule),
        data: {animation: 'Page4'}
    },
    {
        path: MainRoutes.NOT_FOUND,
        loadChildren: () => import('./modules/not-found/not-found.module').then(m => m.NotFoundModule),
        data: {animation: 'Page1'}
    },
    {
        path: '**',
        redirectTo: MainRoutes.NOT_FOUND
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {
        scrollPositionRestoration: 'enabled'
})],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
