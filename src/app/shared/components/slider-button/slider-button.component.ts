import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'app-slider-button',
  templateUrl: './slider-button.component.html',
  styleUrls: ['./slider-button.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SliderButtonComponent),
      multi: true
    }
  ]
})
export class SliderButtonComponent implements OnInit, ControlValueAccessor {

  @Input() checkedText = 'ATIVO';
  @Input() notCheckedText = 'INATIVO';
  @Input() readOnly = false;

  formValue = true;
  disabled = false;
  onTouched = () => {};
  onChange: ((value: boolean) => void) = () => true;

  constructor() {

  }

  ngOnInit(): void {
  }


  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => {}): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  writeValue(obj: boolean): void {
    if (obj !== null) {
      this.formValue = obj;
    }
  }

  setValue(event: boolean): void {
    if (!this.disabled) {
      this.formValue = event;
      this.onChange(event);
      this.onTouched();
    }
  }
}
