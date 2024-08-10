import Customer from "types/Customer.type";
import Review from "types/Review.type";

export const randomID = () => Math.floor(Math.random() * 100000);

// Customer
export function createCustomer(overrides?: Omit<Customer, "id" | "uuid">): Partial<Customer> {
  return {
    ...customerBase,
    ...overrides,
  };
}

export const customerBase: Omit<Customer, "id" | "uuid"> = {
  user_id: 1,
  card_expiry_date: "20281211",
  card_number: "3400010300",
  card_security_code: "123",
  customer_reviews: "2",
  favorite_brands: "Nike",
  favorite_categories: "Masculino",
  last_purchase_date: "20240107",
  shipping_address: "Alameda dos Anjos",
  total_purchases: 1290
};

export const customer: Customer = {
  ...customerBase,
  id: 1,
  uuid: "1djshagb2",
};

export const customerMockToUpdate: Partial<Customer> = {
  user_id: 1,
  card_expiry_date: "20271211",
  card_number: "1111111111111111",
  card_security_code: "111",
  customer_reviews: "2",
  favorite_brands: "Adidas",
  favorite_categories: "Feminino",
  last_purchase_date: "20230107",
  shipping_address: "Alameda dos Anjos - v2",
  total_purchases: 21
};

// Review
export const reviewBase: Partial<Review> = {
  rating: 5,
  product_id: randomID(),
  comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
}

export const enumReview: { id: number, uuid: string, customer_id: number } = {
  id: 1,
  uuid: 'review1uuid',
  customer_id: 1
};

export const review: Review = {
  ...(reviewBase as Review),
  ...enumReview,
  created_at: '2023-12-29 13:00:50',
  updated_at: '2024-02-04 19:25:03'
};


