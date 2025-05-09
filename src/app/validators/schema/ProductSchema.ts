import { checkSchema, Schema } from 'express-validator';
import { SchemaValidator } from '../response/SchemaValidator';

export const getProductSchema: Schema = {}

export const filterProductSchema: Schema = {
  brand_product: {
    in: ['body'],
    optional: true,
    isArray: {
      errorMessage: 'Brand Product must be a Array value',
    },
  },
  gender_product: {
    in: ['body'],
    optional: true,
    isArray: {
      errorMessage: 'Gender Product must be a Array value',
    },
  },
  category_product: {
    in: ['body'],
    optional: true,
    isArray: {
      errorMessage: 'Category Product must be a Array value',
    },
  },
  size: {
    in: ['body'],
    optional: true,
    isObject: {
      errorMessage: 'Size Product must be a Object value',
    },
  }
}

export const getProductIdSchema: Schema = {
  id: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'Product Id is required',
    },
    isNumeric: {
      options: { no_symbols: true }
    },
  },
}

export const createProductSchema: Schema = {
  name: {
    in: ['body'],
    isString: {
      errorMessage: 'Name must be a string',
    },
    notEmpty: {
      errorMessage: 'Name is required',
    }
  },
  price: {
    in: ['body'],
    custom: {
      options: (value) => {
        return /^[0-9]+(\.[0-9]{1,2})?$/.test(value);
      },
      errorMessage: 'Price must be a valid numeric value with up to two decimal places',
    },
    isFloat: {
      options: {
        min: 1,
      },
      errorMessage: 'Price must be a valid value',
    },
    notEmpty: {
      errorMessage: 'Price is required',
    },
  },

  discount_percentage: {
    in: ['body'],
    optional: true,
    isNumeric: {
      options: { no_symbols: true },
      errorMessage: 'Discount percentage must be a numeric value',
    },
    isFloat: {
      options: { max: 90 },
      errorMessage: 'Discount percentage exceeds the limit of 90%',
    },
  },
}

export const updateProductSchema: Schema = {
  uuid: {
    in: ['body'],
    isUUID: {
      errorMessage: 'UUID must be a valid UUID',
    },
  },
  name: {
    in: ['body'],
    optional: true,
    isString: {
      errorMessage: 'Name must be a string',
    },
    notEmpty: {
      errorMessage: 'Name cannot be empty',
    },
  },
  price: {
    in: ['body'],
    optional: true,
    custom: {
      options: (value) => {
        return /^[0-9]+(\.[0-9]{1,2})?$/.test(value);
      },
      errorMessage: 'Price must be a valid numeric value with up to two decimal places',
    },
    isFloat: {
      options: {
        min: 1,
      },
      errorMessage: 'Price must be a valid numeric value',
    },
    notEmpty: {
      errorMessage: 'Price is required',
    },
  },
  discount_percentage: {
    in: ['body'],
    optional: true,
    isNumeric: {
      options: { no_symbols: true },
      errorMessage: 'Discount percentage must be a numeric value',
    },
    isFloat: {
      options: { max: 90 },
      errorMessage: 'Discount percentage exceeds the limit of 90%',
    },
  },
  number_of_installments: {
    in: ['body'],
    optional: true,
    isNumeric: {
      options: { no_symbols: true },
      errorMessage: 'Number of installments must be a numeric value',
    },
    notEmpty: {
      errorMessage: 'Number of installments cannot be empty',
    },
  },
  product_picture: {
    in: ['body'],
    optional: true,
    isString: {
      errorMessage: 'Product picture must be a string',
    },
    notEmpty: {
      errorMessage: 'Product picture cannot be empty',
    },
  },
  color: {
    in: ['body'],
    optional: true,
    isString: {
      errorMessage: 'Color must be a string',
    },
    notEmpty: {
      errorMessage: 'Color cannot be empty',
    },
  },
  size: {
    in: ['body'],
    optional: true,
    isString: {
      errorMessage: 'Size must be a string',
    },
    notEmpty: {
      errorMessage: 'Size cannot be empty',
    },
  },
  free_shipping: {
    in: ['body'],
    optional: true,
    isBoolean: {
      errorMessage: 'Free shipping must be a boolean value',
    },
    notEmpty: {
      errorMessage: 'Free shipping cannot be empty',
    },
  },
  brand_product_id: {
    in: ['body'],
    optional: true,
    isNumeric: {
      options: { no_symbols: true },
      errorMessage: 'Brand product ID must be a numeric value',
    },
    notEmpty: {
      errorMessage: 'Brand product ID cannot be empty',
    },
  },
  gender_product_id: {
    in: ['body'],
    optional: true,
    isNumeric: {
      options: { no_symbols: true },
      errorMessage: 'Gender product ID must be a numeric value',
    },
    notEmpty: {
      errorMessage: 'Gender product ID cannot be empty',
    },
  },
  category_product_id: {
    in: ['body'],
    optional: true,
    isNumeric: {
      options: { no_symbols: true },
      errorMessage: 'Category product ID must be a numeric value',
    },
    notEmpty: {
      errorMessage: 'Category product ID cannot be empty',
    },
  },
  quantity_available: {
    in: ['body'],
    optional: true,
    isNumeric: {
      options: { no_symbols: true },
      errorMessage: 'Quantity available must be a numeric value',
    }
  },
};

export const deleteProductSchema: Schema = {
  id: {
    in: ['params'],
    notEmpty: {
      errorMessage: 'Cart Id is required',
    },
    isNumeric: {
      options: { no_symbols: true }
    },
  },
}

export default {
  get: SchemaValidator.validate(checkSchema(getProductSchema)),
  getId: SchemaValidator.validate(checkSchema(getProductIdSchema)),
  filter: SchemaValidator.validate(checkSchema(filterProductSchema)),
  create: SchemaValidator.validate(checkSchema(createProductSchema)),
  update: SchemaValidator.validate(checkSchema(updateProductSchema)),
  delete: SchemaValidator.validate(checkSchema(deleteProductSchema)),
};
