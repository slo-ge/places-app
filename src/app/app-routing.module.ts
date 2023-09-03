import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultLayoutComponent } from '@app/modules/page-layouts/default-layout/default-layout.component';

const routes: Routes = [
    {
        path: '',
        component: DefaultLayoutComponent,
        loadChildren: () => import('./modules/pages/home/home.module').then(m => m.HomeModule),
    },
    {
        path: 'result-list',
        component: DefaultLayoutComponent,
        loadChildren: () => import('./modules/pages/result-list/result-list.module').then(m => m.ResultListModule),
    },
    {
        path: 'editor',
        component: DefaultLayoutComponent,
        loadChildren: () => import('./modules/pages/editor/editor.module').then(m => m.EditorModule),
    },
    {
        path: 'render',
        loadChildren: () => import('./modules/pages/render/render.module').then(m => m.RenderModule),
    },
    {
        path: 'info',
        component: DefaultLayoutComponent,
        loadChildren: () => import('./modules/pages/static-page/static-page.module').then(m => m.StaticPageModule),
    },
    {
        path: 'statistics',
        component: DefaultLayoutComponent,
        loadChildren: () => import('./modules/pages/statistics/statistics.module').then(m => m.StatisticsModule),
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
