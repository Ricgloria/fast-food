import {Discount} from './discount';

export interface Product {
  id_product?: number;
  product_name: string;
  product_value: number;
  product_discount_value: number;
  status: number | boolean;
}

export interface ProductAndDiscount {
  products: Product[];
  discount: Discount;
}
