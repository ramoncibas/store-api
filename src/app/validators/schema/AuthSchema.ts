import { checkSchema, Schema } from 'express-validator';

const login: Schema = {
  email: {
    in: ['body'],
    isEmail: {
      errorMessage: 'Email must be a string',
    },
    notEmpty: {
      errorMessage: 'Email is required',
    },
    normalizeEmail: {
      options: {
        all_lowercase: true
      }
    }
  },
  password: {
    in: ['body'],
    isStrongPassword: {
      errorMessage: 'The password must be strong',
      options: {
        minLength: 8,
        returnScore: true
      }
    },
    isString: {
      errorMessage: 'Password must be a string',
    },
    notEmpty: {
      errorMessage: 'Password is required',
    }
  },
}

const logout: Schema = {
  email: {
    in: ['body'],
    isEmail: {
      errorMessage: 'Email must be a string',
    },
    notEmpty: {
      errorMessage: 'Email is required',
    },
    normalizeEmail: {
      options: {
        all_lowercase: true
      }
    }
  },
  password: {
    in: ['body'],
    isString: {
      errorMessage: 'UUID must be a string',
    },
    notEmpty: {
      errorMessage: 'UUID is required',
    }
  },
}

const register: Schema = {
  first_name: {
    in: ['body'],
    isString: {
      errorMessage: 'First Name must be a string',
    },
    notEmpty: {
      errorMessage: 'First Name is required',
    },
    isLength: {
      options: { min: 2 },
      errorMessage: 'First Name size is enough'
    }
  },
  last_name: {
    in: ['body'],
    isString: {
      errorMessage: 'Last Name must be a string',
    },
    notEmpty: {
      errorMessage: 'Last Name is required',
    },
    isLength: {
      options: { min: 2 },
      errorMessage: 'Lat Name size is enough'
    }
  },
  email: {
    in: ['body'],
    isEmail: {
      errorMessage: 'Email must be a string',
    },
    notEmpty: {
      errorMessage: 'Email is required',
    },
    normalizeEmail: {
      options: {
        all_lowercase: true
      }
    }
  },
  password: {
    in: ['body'],
    isStrongPassword: {
      errorMessage: 'The password must be strong',
      options: {
        minLength: 8,
        returnScore: true
      }
    },
    isString: {
      errorMessage: 'Password must be a string',
    },
    notEmpty: {
      errorMessage: 'Password is required',
    }
  },
  phone: {
    in: ['body'],
    optional: true,
    isMobilePhone: {
      options: ['pt-BR'],
      errorMessage: 'Invalid Mobile Phone',
    },
    notEmpty: {
      errorMessage: 'Last Name is required',
    },
  },
  type: {
    in: ['body'],
    optional: true,
    isString: {
      errorMessage: 'Type must be a string',
    },
    notEmpty: {
      errorMessage: 'Type is required',
    },
  }
}

export default {
  login: checkSchema(login),
  logout: checkSchema(logout),
  register: checkSchema(register),
};
