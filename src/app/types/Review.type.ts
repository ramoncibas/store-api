export interface Review {
  id: number;
  uuid: string;
  product_id: number;
  customer_id: number;
  rating: number;
  comment: string;
  created_at: Date | string;
  updated_at: Date | string;
}