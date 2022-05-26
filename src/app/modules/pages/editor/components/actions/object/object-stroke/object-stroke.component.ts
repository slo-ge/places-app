import {Component, OnDestroy} from '@angular/core';
import {ActiveObjectService, ObjectAction} from "@app/modules/pages/editor/components/actions/action";
import {FormBuilder} from "@angular/forms";
import {CustomObject} from "@app/core/editor/fabric-object.utils";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-object-stroke',
  templateUrl: './object-stroke.component.html',
  styleUrls: ['./object-stroke.component.scss']
})
export class ObjectStrokeComponent extends ObjectAction<CustomObject> implements OnDestroy {
  form = this.fg.group({
    strokeColor: ['rgba(148,148,148,0.3)'],
    strokeWidth: ['3'],
    strokeUniform: [true],
  });

  formSubscription = Subscription.EMPTY;

  constructor(activeObjectService: ActiveObjectService,
              private fg: FormBuilder) {
    super(activeObjectService);
  }

  ngOnInit(): void {
    this.formSubscription = this.form.valueChanges.subscribe(
      form => {
        this.activeObject.set('stroke', form.strokeColor);
        this.activeObject.set('strokeWidth', form.strokeWidth);
        this.activeObject.set('strokeUniform', form.strokeUniform);
        this.render();
      }
    );
  }

  ngOnDestroy(): void {
    this.formSubscription.unsubscribe();
  }
}
