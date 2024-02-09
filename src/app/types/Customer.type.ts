export default interface Customer {
  id?: number;
  uuid: string;
  user_id: number;
  shipping_address: string;
  card_number?: string;
  card_expiry_date?: string;
  card_security_code?: string;
  last_purchase_date?: string;
  total_purchases?: number;
  favorite_categories?: string;
  favorite_brands?: string;
  customer_reviews?: string;
}