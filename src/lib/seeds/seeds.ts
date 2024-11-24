import bcrypt from 'bcryptjs';

const encryptedPassword = async () => await bcrypt.hash("store#123", 10);

const seeds = async () => {
  return {
    brand_product: [
      { name: "Nike" },
      { name: "Adidas" },
      { name: "Puma" },
    ],

    gender_product: [
      { name: "Male" },
      { name: "Female" },
      { name: "Unisex" },
    ],

    category_product: [
      { name: "Shirt" },
      { name: "Pants" },
      { name: "Shoe" },
    ],

    user: [
      {
        uuid: "31313sda",
        first_name: "Store",
        last_name: "Admin",
        email: "store@admin.com",
        password: await encryptedPassword(),
        phone: "12345",
        user_picture_name: "store.png",
        type: "admin"
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

    product:[
      {
        uuid: "b1a2c3d4",
        name: "Nike Blusa Tech - Azul",
        price: 79.99,
        color: "blue",
        discount_percentage: 15,
        product_picture: "nike_blusa_azul.jpg",
        number_of_installments: 4,
        free_shipping: 1,
        description: "Blusa técnica Nike, ideal para atividades esportivas e uso diário.",
        size: 42,
        brand_id: 1,
        gender_id: 1,
        category_id: 1,
        quantity_available: 50
      },
      {
        uuid: "c2d3e4f5",
        name: "Adidas Tênis Ultraboost - Preto",
        price: 129.99,
        color: "black",
        discount_percentage: 10,
        product_picture: "adidas_tenis_preto.jpg",
        number_of_installments: 6,
        free_shipping: 1,
        description: "Tênis Adidas Ultraboost com conforto máximo e estilo moderno.",
        size: 12,
        brand_id: 2,
        gender_id: 1,
        category_id: 2,
        quantity_available: 30
      },
      {
        uuid: "d3e4f5g6",
        name: "Puma Calças Esportivas - Cinza",
        price: 59.99,
        color: "gray",
        discount_percentage: 5,
        product_picture: "puma_calcas_cinza.jpg",
        number_of_installments: 3,
        free_shipping: 0,
        description: "Calças esportivas Puma, perfeitas para treinos e conforto diário.",
        size: 34,
        brand_id: 3,
        gender_id: 1,
        category_id: 3,
        quantity_available: 70
      },
      {
        uuid: "e4f5g6h7",
        name: "Nike Blusa Casual - Verde",
        price: 69.99,
        color: "green",
        discount_percentage: 20,
        product_picture: "nike_blusa_verde.jpg",
        number_of_installments: 5,
        free_shipping: 1,
        description: "Blusa casual Nike com design moderno e confortável para o dia a dia.",
        size: 29,
        brand_id: 1,
        gender_id: 2,
        category_id: 1,
        quantity_available: 60
      },
      {
        uuid: "f5g6h7i8",
        name: "Adidas Tênis Supernova - Branco",
        price: 119.99,
        color: "white",
        discount_percentage: 8,
        product_picture: "adidas_tenis_branco.jpg",
        number_of_installments: 4,
        free_shipping: 1,
        description: "Tênis Adidas Supernova com suporte e amortecimento avançados.",
        size: 49,
        brand_id: 2,
        gender_id: 2,
        category_id: 2,
        quantity_available: 40
      },
      {
        uuid: "g6h7i8j9",
        name: "Puma Calças Casual - Preto",
        price: 64.99,
        color: "black",
        discount_percentage: 12,
        product_picture: "puma_calcas_preto.jpg",
        number_of_installments: 2,
        free_shipping: 0,
        description: "Calças casuais Puma com ajuste perfeito e conforto durante o uso.",
        size: 35,
        brand_id: 3,
        gender_id: 1,
        category_id: 3,
        quantity_available: 45
      }
    ],

    review: [
      {
        uuid: "review1uuid",
        product_id: 1,
        customer_id: 1,
        rating: 4,
        comment: "Good product!",
      },
    ],

    shopping_cart: [
      {
        uuid: "1kj23n",
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
        purchase_date: "2024-01-15 10:30:00",
      },
    ],

    revoked_tokens: [
      { token: "abc123" },
      { token: "xyz456" },
    ],
  }
};

export default seeds;
