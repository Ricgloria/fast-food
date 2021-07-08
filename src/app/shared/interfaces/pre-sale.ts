import {ReportBasis} from './report-basis';

export interface PreSale {
  id_sale?: number;
  sale_date?: string;
  id_payment_method: number;
  sales_type_id: number;
  phone: string;
  delivery_address: string;
  note: string;
  products: number[];
  is_finished?: boolean | number;
  id_chat_phone: number;
}

export interface PreSaleId {
  preSaleID: number;
}

export interface PreSalesReport {
  status: ReportBasis[];
  salesType: ReportBasis[];
  paymentMethods: ReportBasis[];
}

