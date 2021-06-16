export interface PreSale {
  id_sale: number;
  sale_date?: string;
  id_payment_method: number;
  sales_type_id: number;
  phone: string;
  delivery_address: string;
  note: string;
  products: string;
}
