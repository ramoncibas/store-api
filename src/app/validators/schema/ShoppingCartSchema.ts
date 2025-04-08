import { checkSchema, Schema } from 'express-validator';

export const getCartSchema: Schema = {
  'user.id': {  // Alterado para acessar user.id
    in: ['body', 'query', 'params'],
    custom: {
      options: (value, { req }) => {
        if (!req.user?.id) {
          throw new Error('Usuário não autenticado');
        }
        return true;
      }
    }
  }
}

export const createCartSchema: Schema = {
  customer_id: {
    in: ['params'],
    notEmpty: {
      errorMessage: 'Customer Id is required',
    },
    isLength: {
      options: { min: 1 },
      errorMessage: 'Customer Id should be at least 1 chars',
    },
  },
  product_id: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'Product Id is required',
    },
    isNumeric: {
      options: { no_symbols: true },
      errorMessage: 'Quantity must be a number',
    },
  },
  quantity: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'Quantity is required',
    },
    isNumeric: {
      options: { no_symbols: true },
      errorMessage: 'Quantity must be a number',
    },
  },
}

export const updateCartSchema: Schema = {
  cart_id: {
    in: ['params'],
    notEmpty: {
      errorMessage: 'Cart Id is required',
    },
    isNumeric: {
      options: { no_symbols: true },
      errorMessage: 'Cart Id must be a number',
    },
  },
  customer_id: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'Customer Id is required',
    },
    isNumeric: {
      options: { no_symbols: true },
      errorMessage: 'Customer Id must be a number',
    },
  },
  product_id: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'Product Id is required',
    },
    isNumeric: {
      options: { no_symbols: true },
      errorMessage: 'Quantity must be a number',
    },
  },
  quantity: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'Quantity is required',
    },
    isNumeric: {
      options: { no_symbols: true },
      errorMessage: 'Quantity must be a number',
    },
  },
}

export const removeCartSchema: Schema = {
  cart_id: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'Cart Id is required',
    },
    isNumeric: {
      options: { no_symbols: true },
      errorMessage: 'Cart Id must be a number',
    },
  },
  product_id: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'Product Id is required',
    },
    isNumeric: {
      options: { no_symbols: true },
      errorMessage: 'Product Id must be a number',
    },
  },
  customer_id: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'Customer Id is required',
    },
    isNumeric: {
      options: { no_symbols: true },
      errorMessage: 'Customer Id must be a number',
    },
  },
}

export const clearCartSchema: Schema = {
  customer_id: {
    in: ['params'],
    notEmpty: {
      errorMessage: 'Customer Id is required',
    },
    isNumeric: {
      options: { no_symbols: true }
    },
  },
  options: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'Options is required',
    },
    custom: {
      options: (value) => {
        if (!value || typeof value !== 'object') {
          throw new Error('Options must be a valid object');
        }

        if (!value.reason || !['user_requested', 'system_cleanup'].includes(value.reason)) {
          return false;
        }
        return true;
      },
    },
  },
}

export default {
  get: checkSchema(getCartSchema),
  create: checkSchema(createCartSchema),
  update: checkSchema(updateCartSchema),
  remove: checkSchema(removeCartSchema),
  clear: checkSchema(clearCartSchema),
};
