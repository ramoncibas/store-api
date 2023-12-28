export default interface Review {
  id: number;
  product_id: number;
  customer_id: number;
  rating: number;
  comment: string;
  review_date?: string;
}