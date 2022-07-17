import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges
} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {CustomObject} from "@app/core/editor/fabric-object.utils";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-object-stroke',
  templateUrl: './object-stroke.component.html',
  styleUrls: ['./object-stroke.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ObjectStrokeComponent implements OnDestroy, OnChanges {
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
          this.activeObject.set('stroke', form.strokeColor);
          this.activeObject.set('strokeWidth', form.strokeWidth);
          this.activeObject.set('strokeUniform', form.strokeUniform);
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
      stroke: undefined,
      strokeWidth: 0,
      strokeUniform: false
    };
    this.activeObject.set(_defaultProperties);
    this.render();
  }

  getDefaultValues(activeObject: CustomObject | null): any {
    if (activeObject?.stroke) {
      return {
        strokeColor: [activeObject.stroke],
        strokeWidth: [activeObject.strokeWidth],
        strokeUniform: [activeObject.strokeUniform]
      };
    }

    return {
      strokeColor: ['rgba(148,148,148,0.3)'],
      strokeWidth: [3],
      strokeUniform: [true],
    };
  }

  public render() {
    this.activeObject.canvas?.renderAll();
  }
}
