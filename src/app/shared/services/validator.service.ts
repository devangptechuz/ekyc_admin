import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  Validator,
  AbstractControl,
  ValidatorFn
} from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  static getValidatorErrorMessage(
    validatorName: string,
    validatorValue?: any,
    fieldName?: any
  ) {
    if (!fieldName) {
      fieldName = 'This';
    }
    const config = {
      required: `${fieldName} is required`,
      invalidCreditCard: 'Is invalid credit card number',
      invalidEmailAddress: 'Invalid email address',
      minlength: `Minimum length ${validatorValue.requiredLength}`,
      maxlength: `Maximum length ${validatorValue.requiredLength}`,
      min: `Minimum length ${validatorValue.min}`,
      max: `Maximum length ${validatorValue.max}`,
      equalTo: `Confirm password not matching`,
      invalidUrl: `Invalid url`,
      invalidPattern: `${fieldName} is Invalid`,
      invalidNumber: `Only Numbers are allowed`,
      PINcode: 'Invalid PIN code',
      email: `Please enter a valid email.`,
      pattern: `Please enter a valid data.`,
      invalidAbn: `Please enter a valid abn number.`,
      invalidMobile: `Please enter a valid phone number.`,
      invalidPassword: 'Password must be at least 8 characters long, and contain a number.',
      invalidAccountNumber: 'Invalid account number',
    };
    return config[validatorName];
  }

  static required(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'required': true };
  }

  static creditCardValidator(control) {
    // Visa, MasterCard, American Express, Diners Club, Discover, JCB
    if (
      control.value.match(
        /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/
      )
    ) {
      return null;
    } else {
      return { invalidCreditCard: true };
    }
  }

  emailValidator(control) {
    // RFC 2822 compliant regex
    if (
      control.value.match(
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
      )
    ) {
      return null;
    } else {
      return { invalidEmailAddress: true };
    }
  }

  passwordValidator(control) {
    // {8,25}           - Assert password is between 8 and 25 characters
    // (?=.*[0-9])       - Assert a string has at least one number
    if (control.value) {
      if (
        control.value.match(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,25}$/
        )
      ) {
        return null;
      } else {
        return { invalidPassword: true };
      }
    }
  }

  urlValidator(control) {
    if (control.value) {
      if (
        control.value.match(
          /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/
        )
      ) {
        return null;
      } else {
        return { invalidUrl: true };
      }
    }
  }

  alphaNumericValidator(control) {
    if (control.value) {
      if (control.value.match(/^[a-z A-Z0-9_]*$/)) {
        return null;
      } else {
        return { invalidPattern: true };
      }
    }
  }

  abnFormat(control) {
    if (control.value) {
      if (control.value.match(/^\d{2} \d{3} \d{3} \d{3}$/)) {
        return null;
      } else {
        return { invalidAbn: true };
      }
    }
  }

  mobileFormat(control) {
    if (control.value) {
      if (control.value.match(/^([0-9 ]+)$/)) {
        return null;
      } else {
        return { invalidMobile: true };
      }
    }
  }

  equalTo(equalControlName): ValidatorFn {
    return (
      control: AbstractControl
    ): {
      [key: string]: any;
    } => {
      if (!control['_parent']) return null;

      if (!control['_parent'].controls[equalControlName])
        throw new TypeError(
          'Form Control ' + equalControlName + ' does not exists.'
        );

      var controlMatch = control['_parent'].controls[equalControlName];

      return controlMatch.value == control.value
        ? null
        : {
          equalTo: true
        };
    };
  }

  MatchPassword(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ equalTo: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }

  customValidator(AC: AbstractControl): any {
    const gst_number = AC.get('gst_number').value;
    const cin_number = AC.get('cin_number').value;
    const portfolioImage = AC.get('portfolioImage').value;
    if (!cin_number && !gst_number && !portfolioImage) {
      AC.get('cin_number').setErrors({ fieldRequired: true });
    } else {
      AC.get('cin_number').setErrors(null);
    }
  }

  onlyNumber(control) {
    if (control.value) {
      if (control.value.toString().match(/^-?(0|[1-9]\d*)?$/)) {
        return null;
      } else {
        return { invalidNumber: true };
      }
    }
  }

  customPanValidator(AC: AbstractControl): any {
    const gst_number = AC.get('gst_number').value;
    const cin_number = AC.get('cin_number').value;
    const pan_number = AC.get('pan_number').value;
    if (!cin_number && !gst_number && !pan_number) {
      AC.get('cin_number').setErrors({ docfieldRequired: true });
    } else {
      AC.get('cin_number').setErrors(null);
    }
  }

  // Validate all fields on submit
  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  pincodeValidator(control) {
    // RFC 2822 compliant regex
    if (control.value) {
      if (control.value.match(/^(?=.*[0-9])[0-9]{6,6}$/)) {
        return null;
      } else {
        return { 'PINcode': true };
      }
    } else {
      return { 'PINcode': true };
    }
  }

  accountNumberValidator(control) {
    // RFC 2822 compliant regex
    if (control.value) {
      if (control.value.match(/^[0-9]{9,18}$/)) {
        return null;
      } else {
        return { 'invalidAccountNumber': true };
      }
    } else {
      return { 'invalidAccountNumber': true };
    }
  }

  MatchAccountNumber(AC: AbstractControl) {
    const accountNumber = AC.get('accountNumber').value; // to get value in input tag
    const confirmAccountNumber = AC.get('confirmAccountNumber').value; // to get value in input tag        
    if (accountNumber !== confirmAccountNumber) {
      AC.get('confirmAccountNumber').setErrors({ equalTo: true });
    } else {
      AC.get('confirmAccountNumber').setErrors(null);
      return null;
    }
  }
}
