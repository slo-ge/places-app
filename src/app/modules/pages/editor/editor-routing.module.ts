import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EditorComponent} from "@app/modules/pages/editor/editor.component";
import {PresetResolver} from "@app/modules/pages/editor/services/preset.resolver";

const routes: Routes = [
  {
    path: '',
    component: EditorComponent,
    resolve: {preset: PresetResolver}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditorRoutingModule {
}
