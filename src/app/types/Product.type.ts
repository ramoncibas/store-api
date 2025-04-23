import { UUID } from "crypto";

export type URL = `https://${string}` | `http://${string}`;
export type Price = number & { readonly brand: unique symbol };
export type Percentage = number & { readonly brand: unique symbol };
export type Installments = number & { readonly brand: unique symbol };
export type HexColor = `#${string}`;
export type Size = 'PP' | 'P' | 'M' | 'G' | 'GG' | 'XG' | string;
export type ProductId = number & { readonly brand: unique symbol };
export type CustomerId = number & { readonly brand: unique symbol };
export type EntityId = number & { readonly brand: unique symbol };
export type Quantity = number & { readonly brand: unique symbol };

export interface Product {
  id: ProductId;
  uuid: UUID;
  name: string;
  price: Price;
  discount_percentage: Percentage;
  number_of_installments: Installments;
  product_picture: URL;
  color: HexColor;
  size: Size;
  free_shipping: boolean;
  brand_product_id: EntityId;
  gender_product_id: EntityId;
  category_product_id: EntityId;
  quantity_available: Quantity;
}

export interface SizeRange {
  min: number;
  max: number;
}

export interface ProductFilter {
  brand_id: EntityId[];
  gender_id: EntityId[];
  category_id: EntityId[];
  sizeRange: SizeRange;
}

// export interface ShoppingCartItem {
//   id: EntityId;
//   uuid: UUID;
//   product_id: ProductId;
//   customer_id: CustomerId;
//   quantity: Quantity;
// }

export interface ShoppingCartItem {
  id: EntityId;
  uuid: UUID;
  product_id: ProductId;
  customer_id: CustomerId;
  quantity: number;
}

export interface AttributesColumn {
  id: EntityId;
  name: string;
}

export interface AttributesResult {
  brands: AttributesColumn[];
  genders: AttributesColumn[];
  categories: AttributesColumn[];
  sizeRange: SizeRange;
}