// TODO: Implementar seeds para popular o banco de dados com dados aleatórios
// import bcrypt from 'bcryptjs';
// import { faker } from '@faker-js/faker';

// const encryptedPassword = async () => await bcrypt.hash("store#123", 10);

// const generateRandomData = async () => {
//   const brands = Array.from({ length: 10 }, () => ({ name: faker.company.name() }));
//   const genders = ["Male", "Female", "Unisex"].map(name => ({ name }));
//   const categories = Array.from({ length: 10 }, () => ({ name: faker.commerce.department() }));

//   const users = Array.from({ length: 10 }, () => ({
//     uuid: faker.datatype.uuid(),
//     first_name: faker.name.firstName(),
//     last_name: faker.name.lastName(),
//     email: faker.internet.email(),
//     password: await encryptedPassword(),
//     phone: faker.phone.number(),
//     user_picture_name: faker.image.avatar(),
//     type: "user"
//   }));

//   const customers = users.map((user, index) => ({
//     user_id: index + 1,
//     uuid: faker.datatype.uuid(),
//     card_expiry_date: faker.date.future().toISOString().split('T')[0].replace(/-/g, ''),
//     card_number: faker.finance.creditCardNumber(),
//     card_security_code: faker.finance.creditCardCVV(),
//     customer_reviews: faker.datatype.number({ min: 1, max: 10 }).toString(),
//     favorite_brands: faker.company.name(),
//     favorite_categories: faker.commerce.department(),
//     last_purchase_date: faker.date.past().toISOString().split('T')[0],
//     shipping_address: faker.address.streetAddress(),
//     total_purchases: faker.datatype.number({ min: 100, max: 10000 })
//   }));

//   const products = Array.from({ length: 10 }, () => ({
//     uuid: faker.datatype.uuid(),
//     name: faker.commerce.productName(),
//     price: parseFloat(faker.commerce.price()),
//     color: faker.color.human(),
//     discount_percentage: faker.datatype.number({ min: 0, max: 50 }),
//     product_picture: faker.image.imageUrl(),
//     number_of_installments: faker.datatype.number({ min: 1, max: 12 }),
//     free_shipping: faker.datatype.boolean() ? 1 : 0,
//     description: faker.commerce.productDescription(),
//     size: faker.datatype.number({ min: 30, max: 50 }),
//     brand_id: faker.datatype.number({ min: 1, max: brands.length }),
//     gender_id: faker.datatype.number({ min: 1, max: genders.length }),
//     category_id: faker.datatype.number({ min: 1, max: categories.length }),
//     quantity_available: faker.datatype.number({ min: 0, max: 100 })
//   }));

//   const reviews = Array.from({ length: 10 }, () => ({
//     uuid: faker.datatype.uuid(),
//     product_id: faker.datatype.number({ min: 1, max: products.length }),
//     customer_id: faker.datatype.number({ min: 1, max: customers.length }),
//     rating: faker.datatype.number({ min: 1, max: 10 }),
//     comment: faker.lorem.sentence()
//   }));

//   const shoppingCarts = Array.from({ length: 10 }, () => ({
//     uuid: faker.datatype.uuid(),
//     customer_id: faker.datatype.number({ min: 1, max: customers.length }),
//     product_id: faker.datatype.number({ min: 1, max: products.length }),
//     quantity: faker.datatype.number({ min: 1, max: 5 })
//   }));

//   const purchases = Array.from({ length: 10 }, () => ({
//     customer_id: faker.datatype.number({ min: 1, max: customers.length }),
//     total_amount: parseFloat(faker.commerce.price()),
//     total_value: parseFloat(faker.commerce.price()),
//     purchase_date: faker.date.recent().toISOString()
//   }));

//   const revokedTokens = Array.from({ length: 10 }, () => ({
//     token: faker.datatype.uuid()
//   }));

//   return {
//     brand_product: brands,
//     gender_product: genders,
//     category_product: categories,
//     user: users,
//     customer: customers,
//     product: products,
//     review: reviews,
//     shopping_cart: shoppingCarts,
//     purchase: purchases,
//     revoked_tokens: revokedTokens
//   };
// };

// const seeds = async () => await generateRandomData();

// export default seeds;

import bcrypt from 'bcryptjs';

const encryptedPassword = async () => await bcrypt.hash("store#123", 10);

const seeds = async () => {
  return {
    brand_product: [
      { name: "Adidas" },
      { name: "Nike" },
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
        brand_id: 2,
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
        brand_id: 1,
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
        brand_id: 2,
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
        brand_id: 1,
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
      {
        uuid: "k12djnkjn12d",
        product_id: 2,
        customer_id: 2,
        rating: 10,
        comment: "FATALITY product!",
      },
      {
        uuid: "dk12jnd1dkj",
        product_id: 3,
        customer_id: 3,
        rating: 7,
        comment: "INSANE product!",
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
