import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RenderComponent} from "@app/modules/pages/render/render/render.component";
import {PresetResolver} from "@app/core/editor/preset.resolver";

const routes: Routes = [{
  path: '',
  component: RenderComponent,
  resolve: {preset: PresetResolver}
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RenderRoutingModule {
}
