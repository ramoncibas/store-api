export default interface Product {
  id?: number;
  uuid: string;
  name: string;
  price: number;
  discount_percentage: number;
  number_of_installments: number;
  product_picture: string;
  color: string;
  size: string;
  free_shipping: boolean;
  brand_product_id: number;
  gender_product_id: number;
  category_product_id: number;
  quantity_available?: number;
}

export interface ShoppingCartItem {
  id: number;
  product_id: number;
  customer_id: number;
  quantity: number;
}

export interface AspectColumn {
  id: number;
  name: string;
}

export interface AspectResult {
  brands: AspectColumn[];
  genders: AspectColumn[];
  categories: AspectColumn[];
  sizes: Partial<AspectColumn[]>;
}