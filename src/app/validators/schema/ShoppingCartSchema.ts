import { checkSchema, Schema } from 'express-validator';
import { SchemaValidator } from '../response/SchemaValidator';
import { AppError } from '../../builders/errors';

export const getCartSchema: Schema = {
  'user.id': {
    in: ['body', 'query', 'params'],
    custom: {
      options: (value, { req }) => {
        if (!req.user?.id) {
            throw new AppError('User is not authenticated');
        }
        return true;
      }
    }
  }
}

export const addToCartSchema: Schema = {
  'user.id': {
    in: ['body', 'query', 'params'],
    custom: {
      options: (value, { req }) => {
        if (!req.user?.id) {
            throw new AppError('User is not authenticated');
        }
        return true;
      }
    }
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
  'user.id': {
    in: ['body', 'query', 'params'],
    custom: {
      options: (value, { req }) => {
        if (!req.user?.id) {
            throw new AppError('User is not authenticated');
        }
        return true;
      }
    }
  },
  id: {
    in: ['params'],
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
  'user.id': {
    in: ['body', 'query', 'params'],
    custom: {
      options: (value, { req }) => {
        if (!req.user?.id) {
            throw new AppError('User is not authenticated');
        }
        return true;
      }
    }
  },
  id: {
    in: ['params'],
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
}

export const clearCartSchema: Schema = {
  'user.id': {
    in: ['body', 'query', 'params'],
    custom: {
      options: (value, { req }) => {
        if (!req.user?.id) {
            throw new AppError('User is not authenticated');
        }
        return true;
      }
    }
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
  get: SchemaValidator.validate(checkSchema(getCartSchema)),
  add: SchemaValidator.validate(checkSchema(addToCartSchema)),
  update: SchemaValidator.validate(checkSchema(updateCartSchema)),
  remove: SchemaValidator.validate(checkSchema(removeCartSchema)),
  clear: SchemaValidator.validate(checkSchema(clearCartSchema)),
};
