import bcrypt from 'bcryptjs';

const encryptedPassword = async () => await bcrypt.hash('store#123', 10);

const seeds = async () => {
  return {
    size_product: [
      { size: 'Small' },
      { size: 'Medium' },
      { size: 'Large' },
    ],

    brand_product: [
      { name: 'Brand A' },
      { name: 'Brand B' },
      { name: 'Brand C' },
    ],

    gender_product: [
      { name: 'Male' },
      { name: 'Female' },
      { name: 'Unisex' },
    ],

    category_product: [
      { name: 'Electronics' },
      { name: 'Clothing' },
      { name: 'Home Decor' },
    ],

    user: [
      {
        uuid: '31313sda',
        first_name: 'Store',
        last_name: 'Admin',
        email: 'store@admin.com',
        password: await encryptedPassword(),
        phone: '12345',
        user_picture_name: 'store.png'
      }
    ],

    customer: [
      {
        user_id: 1,
        uuid: "1djshagb2",
        card_expiry_date: "20281211",
        card_number: "3400010300",
        card_security_code: "123",
        customer_reviews: "2",
        favorite_brands: "Nike",
        favorite_categories: "Masculino",
        last_purchase_date: "20240107",
        shipping_address: "Alameda dos Anjos",
        total_purchases: 1290
      },
    ],

    product: [
      {
        uuid: '1jihbn',
        name: 'Product A',
        price: 49.99,
        discount_percentage: 10,
        product_picture: 'product_a.jpg',
        number_of_installments: 3,
        free_shipping: 1,
        description: 'Lorem ipsum...',
        size_id: 1,
        brand_id: 1,
        gender_id: 1,
        category_id: 1,
        quantity_available: 100,
      },
    ],

    review: [
      {
        uuid: 'review1uuid',
        product_id: 1,
        customer_id: 1,
        rating: 4,
        comment: 'Good product!',
        review_date: '2024-01-15',
      },
    ],

    shopping_cart: [
      {
        uuid: '1kj23n',
        customer_id: 1,
        product_id: 1,
        quantity: 2,
      },
    ],

    purchase: [
      {
        customer_id: 1,
        total_amount: 99.98,
        total_value: 89.98,
        purchase_date: '2024-01-15 10:30:00',
      },
    ],

    revoked_tokens: [
      { token: 'abc123' },
      { token: 'xyz456' },
    ],
  }
};

export default seeds;
