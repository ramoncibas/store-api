import { checkSchema, Schema } from 'express-validator';
import { SchemaValidator } from '../response/SchemaValidator';

export const getUserSchema: Schema = {
  uuid: {
    in: ['params'],
    notEmpty: {
      errorMessage: 'UUID is required',
    },
  },
};

export const getAllUserSchema: Schema = {};

export const updateUserSchema: Schema = {
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

export const deleteUserSchema: Schema = {
  uuid: {
    in: ['params'],
    notEmpty: {
      errorMessage: 'UUID is required',
    },
  },
};


export default {
  get: SchemaValidator.validate(checkSchema(getUserSchema)),
  getAll: SchemaValidator.validate(checkSchema(getAllUserSchema)),
  update: SchemaValidator.validate(checkSchema(updateUserSchema)),
  delete: SchemaValidator.validate(checkSchema(deleteUserSchema)),
};
