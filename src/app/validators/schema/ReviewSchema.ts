import { checkSchema, Schema } from 'express-validator';
import { SchemaValidator } from '../response/SchemaValidator';
import { AppError } from 'builders/errors';

export const defaultValidateCustomer: Schema = {
  'user.id': {
    in: ['body', 'query', 'params'],
    custom: {
      options: (value: any, { req }: any) => {
        if (!req.user?.id) {
          throw new AppError('User is not authenticated');
        }
        return true;
      },
    },
  },
};

export const getReviewByIdSchema: Schema = {
  id: {
    in: ['params'],
    notEmpty: {
      errorMessage: 'Product Id is required',
    },
    isNumeric: {
      errorMessage: 'Product Id must be a number',
      options: { no_symbols: true }
    },
  },
}

export const getReviewByCustomerIdSchema: Schema = {
  ...defaultValidateCustomer,
}

export const createReviewSchema: Schema = {
  ...defaultValidateCustomer,
  product_id: {
    in: ['body'],
    isNumeric: {
      options: { no_symbols: true },
      errorMessage: 'ProductID must be a number'
    },
    notEmpty: {
      errorMessage: 'ProductID cannot be empty',
    },
  },
  rating: {
    in: ['body'],
    isNumeric: {
      options: { no_symbols: true },
      errorMessage: 'Rating must be a number',
    },
    notEmpty: {
      errorMessage: 'Rating cannot be empty',
    },
  },
  comment: {
    in: ['body'],
    optional: true,
    isString: {
      errorMessage: 'Comment must be a string',
    },
    notEmpty: {
      errorMessage: 'Comment cannot be empty',
    },
  },
}

export const updateReviewSchema: Schema = {
  uuid: {
    in: ['params'],
    notEmpty: {
      errorMessage: 'ReviewUUID is required',
    },
    isString: {
      errorMessage: 'ReviewUUID must be a string',
    },
  },
  rating: {
    in: ['body'],
    optional: true,
    isNumeric: {
      options: { no_symbols: true },
      errorMessage: 'Rating must be a number',
    },
    notEmpty: {
      errorMessage: 'Rating cannot be empty',
    },
  },
  comment: {
    in: ['body'],
    optional: true,
    isString: {
      errorMessage: 'Comment must be a string',
    },
    notEmpty: {
      errorMessage: 'Comment cannot be empty',
    },
  },
}

export const removeReviewSchema: Schema = {
  uuid: {
    in: ['params'],
    notEmpty: {
      errorMessage: 'ReviewUUID is required',
    },
    isString: {
      errorMessage: 'ReviewUUID must be a string',
    },
  },
}

export default {
  getById: SchemaValidator.validate(checkSchema(getReviewByIdSchema)),
  getByCustomerId: SchemaValidator.validate(checkSchema(getReviewByCustomerIdSchema)),
  create: SchemaValidator.validate(checkSchema(createReviewSchema)),
  update: SchemaValidator.validate(checkSchema(updateReviewSchema)),
  remove: SchemaValidator.validate(checkSchema(removeReviewSchema)),
};
