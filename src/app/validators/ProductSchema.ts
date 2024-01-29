import { checkSchema, Schema } from 'express-validator';

const create: Schema = {
  name: {
    in: ['body'],
    isString: {
      errorMessage: 'Name must be a string',
    },
    notEmpty: {
      errorMessage: 'Name is required',
    },
  },
  price: {
    in: ['body'],
    isNumeric: {
      errorMessage: 'Price must be a numeric value',
    },
    notEmpty: {
      errorMessage: 'Price is required',
    },
  },
  discount_percentage: {
    in: ['body'],
    optional: true,
    isNumeric: {
      errorMessage: 'Discount percentage must be a numeric value',
    },
    isFloat: {
      options: { max: 90 },
      errorMessage: 'Discount percentage exceeds the limit of 90%',
    },
  },
}

export default {
  create: checkSchema(create),
  // update: checkSchema(update),
};
