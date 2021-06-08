import {Product} from './product';
import {PaymentMethod} from './payment-method';
import {Deliveryman} from './deliveryman';

export interface SaleBox {
  products: Product[];
  paymentMethods: PaymentMethod[];
  deliveryman: Deliveryman[];
}

export interface SendSale {
  id_payment_method: number;
  sale_value: number;
  is_delivery: boolean | number;
  delivery_address: string;
  id_deliveryman: number| null;
  send_products: SendCleanProduct[];
}

export interface SendProduct {
  amount: number;
  product: Product;
}

export interface SendCleanProduct {
  amount: number;
  id_product: number;
}

export interface Sale {
  id_sale: number;
  sale_date: Date;
  sale_value: string;
  name: string;
  description: string;
}
