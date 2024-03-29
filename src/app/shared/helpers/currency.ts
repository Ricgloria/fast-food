import {CurrencyMaskConfig, CurrencyMaskInputMode} from 'ngx-currency';

export const customCurrencyMaskConfig: CurrencyMaskConfig = {
  align: 'right',
  allowNegative: false,
  allowZero: true,
  decimal: ',',
  precision: 2,
  prefix: 'R$ ',
  suffix: '',
  thousands: '.',
  nullable: true,
  min: undefined,
  max: undefined,
  inputMode: CurrencyMaskInputMode.FINANCIAL
};
