import { checkSchema, Schema } from 'express-validator';

const get: Schema = {
  id: {
    in: ['params'],
    notEmpty: {
      errorMessage: 'Id is required',
    },
    isLength: {
      options: { min: 1 },
      errorMessage: 'Id should be at least 1 chars',
    },
  },
}

const create: Schema = {
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

const update: Schema = {
  id: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'Cart Id is required',
    },
    isNumeric: {
      options: { no_symbols: true },
      errorMessage: 'Cart Id must be a number',
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

const remove: Schema = {
  id: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'Cart Id is required',
    },
    isNumeric: {
      options: { no_symbols: true }
    },
  },
}

const clean: Schema = {
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
  get: checkSchema(get),
  create: checkSchema(create),
  update: checkSchema(update),
  remove: checkSchema(remove),
  clean: checkSchema(clean),
};
