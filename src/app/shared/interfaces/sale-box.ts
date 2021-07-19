import {Product} from './product';
import {PaymentMethod} from './payment-method';
import {Deliveryman} from './deliveryman';
import {SalesType} from './sales-type';
import {ChatPhone} from './chat-phone';
import {ExpectedTime} from './expected-time';
import {ReportBasis} from './report-basis';

export interface SaleBox {
  products: Product[];
  paymentMethods: PaymentMethod[];
  deliveryman: Deliveryman[];
  salesType: SalesType[];
  chatPhone: ChatPhone;
  expectedTimes: ExpectedTime[];
}

export interface SendSale {
  id_payment_method: number;
  sale_value: number;
  sales_type_id: number;
  delivery_address: string;
  id_deliveryman: number | null;
  note: string;
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

export interface SalesReport {
  total: number;
  salesType: ReportBasis[];
  paymentMethods: ReportBasis[];
  users: ReportBasis[];
  deliverymen: ReportBasis[];
  itemsSale: ReportBasis[];
  lastMonth: ReportBasis[];
  lastSevenDays: ReportBasis[];
  sixMonth: ReportBasis[];
  allSales: ReportBasis[];
}

