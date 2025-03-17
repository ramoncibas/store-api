import { checkSchema, Schema } from 'express-validator';

export const getCartSchema: Schema = {
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

export const cleanCartSchema: Schema = {
  customer_id: {
    in: ['params'],
    notEmpty: {
      errorMessage: 'Customer Id is required',
    },
    isNumeric: {
      options: { no_symbols: true }
    },
  },
}

export default {
  get: checkSchema(getCartSchema),
  create: checkSchema(createCartSchema),
  update: checkSchema(updateCartSchema),
  remove: checkSchema(removeCartSchema),
  clean: checkSchema(cleanCartSchema),
};
