import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayComponent } from './overlay/overlay.component';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";


@NgModule({
	declarations: [OverlayComponent],
	imports: [
		CommonModule,
		FontAwesomeModule
	],
	exports: [
		OverlayComponent
	],
	entryComponents: [OverlayComponent]
})
export class CustomOverlayModule { }
