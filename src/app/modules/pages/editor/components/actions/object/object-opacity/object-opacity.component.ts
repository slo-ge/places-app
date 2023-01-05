import {Component, Input, OnChanges, OnDestroy, SimpleChanges} from '@angular/core';
import {CustomObject} from "@app/core/editor/fabric-object.utils";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-object-opacity',
  templateUrl: './object-opacity.component.html',
  styleUrls: ['./object-opacity.component.scss']
})
export class ObjectOpacityComponent implements OnDestroy, OnChanges {
  @Input()
  activeObject!: CustomObject;

  form!: FormGroup;
  formCollapsed = false;
  private formSubscription = Subscription.EMPTY;

  constructor(private fg: FormBuilder) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.formSubscription.unsubscribe();

    if (this.activeObject) {
      if (!this.form) {
        this.form = this.fg.group(this.getDefaultValues(this.activeObject));
      } else {
        this.form.reset(this.getDefaultValues(this.activeObject));
      }

      this.formCollapsed = !!this.activeObject.stroke;

      this.formSubscription = this.form.valueChanges.subscribe(form => {
          this.activeObject.set('opacity', form.opacity);
          this.render();
        }
      );
    }
  }

  ngOnDestroy(): void {
    this.formSubscription.unsubscribe();
  }

  resetProperties() {
    const _defaultProperties = {
      opacity: 1
    };
    this.activeObject.set(_defaultProperties);
    this.render();
  }

  getDefaultValues(activeObject: CustomObject | null): any {
    if (activeObject?.opacity) {
      return {
        opacity: [activeObject.opacity]
      };
    }

    return {
      opacity: [1]
    };
  }

  public render() {
    this.activeObject.canvas?.renderAll();
  }
}
