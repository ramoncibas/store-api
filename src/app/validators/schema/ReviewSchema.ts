import { checkSchema, Schema } from 'express-validator';

const getByID: Schema = {
  id: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'Product Id is required',
    },
    isNumeric: {
      errorMessage: 'Product Id must be a number',
      options: { no_symbols: true }
    },
  },
}

const getByUUID: Schema = {
  uuid: {
    in: ['params'],
    notEmpty: {
      errorMessage: 'Customer UUID is required',
    },
    isString: {
      errorMessage: 'Customer UUID must be a string',
    },
  },
}

const create: Schema = {
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

const update: Schema = {
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

const remove: Schema = {
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
  getByID: checkSchema(getByID),
  getByUUID: checkSchema(getByUUID),
  create: checkSchema(create),
  update: checkSchema(update),
  remove: checkSchema(remove),
};
