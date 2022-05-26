import {Component, OnInit} from '@angular/core';
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
export class ObjectShadowComponent extends ObjectAction<CustomObject> implements OnInit  {
  form = this.fg.group({
    color: ['rgba(148,148,148,0.3)'],
    offsetX: ['45'],
    offsetY: ['45'],
    blur: ['5']
  });

  formSubscription = Subscription.EMPTY;

  constructor(activeObjectService: ActiveObjectService,
              private fg: FormBuilder) {
    super(activeObjectService);
  }

  ngOnInit(): void {
    this.formSubscription = this.form.valueChanges.subscribe(
      form => {
        const shadow = new fabric.Shadow();
        shadow.color = form.color;
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
  }
}
