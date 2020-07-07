import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ValidationService } from '../../services/validator.service';

@Component({
  selector: 'app-control-messages',
  templateUrl: './control-messages.component.html'
})
export class ControlMessagesComponent implements OnInit {
  @Input() control: FormControl;
  @Input() fieldName: string;
  constructor(private validationService: ValidationService) { }

  ngOnInit() { }

  get errorMessage() {
    for (const propertyName in this.control.errors) {
      if (
        this.control.errors.hasOwnProperty(propertyName) &&
        this.control.touched
      ) {
        if (propertyName === 'serverError') {
          return this.control.errors[propertyName];
        }
        return ValidationService.getValidatorErrorMessage(
          propertyName,
          this.control.errors[propertyName],
          this.fieldName
        );
      }
    }
    return null;
  }
}
