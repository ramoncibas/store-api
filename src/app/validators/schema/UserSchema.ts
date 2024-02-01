import { checkSchema, Schema } from 'express-validator';

const get: Schema = {
  uuid: {
    in: ['params'],
    notEmpty: {
      errorMessage: 'UUID is required',
    },
  },
};

const getAll: Schema = {};

const update: Schema = {
  uuid: {
    in: ['params'],
    notEmpty: {
      errorMessage: 'UUID is required',
    },
  },
  phone: {
    in: ['body'],
    optional: true,
    isMobilePhone: {
      errorMessage: 'Invalid phone number format',
    },
  },
  email: {
    in: ['body'],
    optional: true,
    isEmail: {
      errorMessage: 'Invalid email address',
    },
  },
  user_picture_name: {
    in: ['body'],
    optional: true,
    isString: {
      errorMessage: 'Invalid user picture name',
    },
  },
};

export default {
  get: checkSchema(get),
  getAll: checkSchema(getAll),
  update: checkSchema(update),
};
