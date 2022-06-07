import { Component, OnDestroy, OnInit } from '@angular/core';
import {ActiveObjectService, ObjectAction} from "@app/modules/pages/editor/components/actions/action";
import {CustomObject} from "@app/core/editor/fabric-object.utils";
import {fabric} from "fabric";
import {FormBuilder} from "@angular/forms";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-object-shadow',
  templateUrl: './object-shadow.component.html',
  styleUrls: ['./object-shadow.component.scss']
})
export class ObjectShadowComponent extends ObjectAction<CustomObject> implements OnInit, OnDestroy  {
  form = this.fg.group({
      color: ['#C2C2C2'],
      offsetX: ['45'],
      offsetY: ['45'],
      blur: ['5'],
      opacity: [0.5]
  });

  private formSubscription = Subscription.EMPTY;

  constructor(activeObjectService: ActiveObjectService,
              private fg: FormBuilder) {
    super(activeObjectService);
  }

  ngOnInit(): void {
    this.formSubscription = this.form.valueChanges.subscribe(
      form => {
        console.log('on');
        const shadow = new fabric.Shadow();
        shadow.color = form.color + ObjectShadowComponent.calcTransparencyInHex(form.opacity);
        shadow.offsetX = form.offsetX;
        shadow.offsetY = form.offsetY;
        shadow.blur = form.blur;
        this.activeObject.set('shadow', shadow);
        this.render();
      }
    );
  }

  ngOnDestroy(): void {
    this.formSubscription.unsubscribe();
    this.form.reset();
  }

  private static  calcTransparencyInHex(opacityNumber: number) {
      const alpha = Math.round(opacityNumber * 255);
      return (alpha + 0x10000).toString(16).substr(-2).toUpperCase();
  }
}
