import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditorComponent } from '@app/modules/pages/editor/editor.component';
import { presetResolver } from '@app/core/editor/preset.resolver';

const routes: Routes = [
    {
        path: '',
        component: EditorComponent,
        resolve: { preset: presetResolver },
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditorRoutingModule {
}
