import * as Schema from '../../../validators/schema/index';
import { convertToSwaggerSchema } from './convertSchema';

// Define a type for the validation schema
export const swaggerSchemas = {
  AuthLogin: convertToSwaggerSchema(Schema.loginSchema),
  AuthLogout: convertToSwaggerSchema(Schema.logoutSchema),
  AuthRegister: convertToSwaggerSchema(Schema.registerSchema),

  CustomerGet: convertToSwaggerSchema(Schema.getCustomerSchema),
  CustomerCreate: convertToSwaggerSchema(Schema.createCustomerSchema),
  CustomerUpdate: convertToSwaggerSchema(Schema.updateCustomerSchema),
  CustomerRemove: convertToSwaggerSchema(Schema.removeCustomerSchema),
  
  ProductGet: convertToSwaggerSchema(Schema.getProductSchema),
  ProductGetId: convertToSwaggerSchema(Schema.getProductIdSchema),
  ProductFilter: convertToSwaggerSchema(Schema.filterProductSchema),
  ProductCreate: convertToSwaggerSchema(Schema.createProductSchema),
  ProductUpdate: convertToSwaggerSchema(Schema.updateProductSchema),
  ProductRemove: convertToSwaggerSchema(Schema.deleteProductSchema),

  ReviewGetById: convertToSwaggerSchema(Schema.getReviewByIdSchema),
  ReviewGetByCustomerId: convertToSwaggerSchema(Schema.getReviewByCustomerIdSchema),
  ReviewCreate: convertToSwaggerSchema(Schema.createReviewSchema),
  ReviewUpdate: convertToSwaggerSchema(Schema.updateReviewSchema),
  ReviewRemove: convertToSwaggerSchema(Schema.removeReviewSchema),

  ShoppingCartGet: convertToSwaggerSchema(Schema.getCartSchema),
  ShoppingCartCreate: convertToSwaggerSchema(Schema.getCartSchema),
  ShoppingCartUpdate: convertToSwaggerSchema(Schema.updateCartSchema),
  ShoppingCartRemove: convertToSwaggerSchema(Schema.removeCartSchema),
  ShoppingCartClean: convertToSwaggerSchema(Schema.clearCartSchema),

  UserGet: convertToSwaggerSchema(Schema.getUserSchema),
  UserGetAll: convertToSwaggerSchema(Schema.getAllUserSchema),
  UserUpdate: convertToSwaggerSchema(Schema.updateUserSchema)
};
