export default interface Review {
  id: number | string;
  product_id: number | string;
  customer_id: number | string;
  rating: number;
  comment: string;
  review_date?: string;
}