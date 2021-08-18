import {AbstractControl} from '@angular/forms';

export class CustomValidator {
  public static CpfValidator(control: AbstractControl): null | object {
    const cpf = control.value;

    if (cpf) {
      let numbers;
      let digits;
      let sum: number;
      let i: number;
      let result: number;
      let equalDigits: number;

      equalDigits = 1;
      if (cpf.length < 11) {
        return {cpfNotValid: true};
      }

      for (i = 0; i < cpf.length - 1; i++) {
        if (cpf.charAt(i) !== cpf.charAt(i + 1)) {
          equalDigits = 0;
          break;
        }
      }

      if (!equalDigits) {
        numbers = cpf.substring(0, 9);
        digits = cpf.substring(9);
        sum = 0;
        for (i = 10; i > 1; i--) {
          sum += numbers.charAt(10 - i) * i;
        }

        result = sum % 11 < 2 ? 0 : 11 - (sum % 11);

        if (result !== Number(digits.charAt(0))) {
          return {cpfNotValid: true};
        }
        numbers = cpf.substring(0, 10);
        sum = 0;

        for (i = 11; i > 1; i--) {
          sum += numbers.charAt(11 - i) * i;
        }
        result = sum % 11 < 2 ? 0 : 11 - (sum % 11);

        if (result !== Number(digits.charAt(1))) {
          return {cpfNotValid: true};
        }
        return null;
      } else {
        return {cpfNotValid: true};
      }
    }
    return null;
  }

  public static CnpjValidator(control: AbstractControl): null | object {

    const cnpj = control.value;

    if (cnpj) {
      if (cnpj === '00000000000000' ||
        cnpj === '11111111111111' ||
        cnpj === '22222222222222' ||
        cnpj === '33333333333333' ||
        cnpj === '44444444444444' ||
        cnpj === '55555555555555' ||
        cnpj === '66666666666666' ||
        cnpj === '77777777777777' ||
        cnpj === '88888888888888' ||
        cnpj === '99999999999999') {
        return {cnpjNotValid: true};
      }

      let size = cnpj.length - 2;
      let numbers = cnpj.substring(0, size);
      const digits = cnpj.substring(size);
      let sum = 0;
      let position = size - 7;
      let result = 0;

      for (let i = size; i >= 1; i--) {
        sum += numbers.charAt(size - i) * position--;
        if (position < 2) {
          position = 9;
        }
      }
      result = sum % 11 < 2 ? 0 : 11 - sum % 11;

      if (result !== Number(digits.charAt(0))) {
        return {cnpjNotValid: true};
      }
      size = size + 1;
      numbers = cnpj.substring(0, size);
      sum = 0;
      position = size - 7;

      for (let i = size; i >= 1; i--) {
        sum += numbers.charAt(size - i) * position--;
        if (position < 2) {
          position = 9;
        }
      }

      result = sum % 11 < 2 ? 0 : 11 - sum % 11;

      if (result !== Number(digits.charAt(1))) {
        return {cnpjNotValid: true};
      }
      return null;
    }
    return null;
  }
}

