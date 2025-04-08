import { checkSchema, Schema } from 'express-validator';

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
  id: {
    in: ['params'],
    notEmpty: {
      errorMessage: 'Customer Id is required',
    },
    isString: {
      errorMessage: 'Customer Id must be a string',
    },
  },
}

export const createReviewSchema: Schema = {
  uuid: {
    in: ['params'],
    isString: {
      errorMessage: 'CustomerUUID must be a string',
    },
    notEmpty: {
      errorMessage: 'CustomerUUID is required',
    },
  },
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
  getById: checkSchema(getReviewByIdSchema),
  getByCustomerId: checkSchema(getReviewByCustomerIdSchema),
  create: checkSchema(createReviewSchema),
  update: checkSchema(updateReviewSchema),
  remove: checkSchema(removeReviewSchema),
};
