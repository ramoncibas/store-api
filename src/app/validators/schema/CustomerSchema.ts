import { checkSchema, Schema } from 'express-validator';

const get: Schema = {
  uuid: {
    in: ['params'],
    isString: {
      errorMessage: 'UUID must be a string',
    },
    notEmpty: {
      errorMessage: 'UUID is required',
    }
  },
}

const create: Schema = {
  user_id: {
    in: ['body'],
    isNumeric: {
      options: { no_symbols: true },
      errorMessage: 'UserId must be a number',
    },
    notEmpty: {
      errorMessage: 'UserId is required',
    }
  },
  shipping_address: {
    in: ['body'],
    isString: {
      errorMessage: 'Shipping Address must be a string',
    },
    notEmpty: {
      errorMessage: 'Shipping Address is required',
    }
  },
  card_number: {
    in: ['body'],
    optional: true,
    isString: {
      errorMessage: 'Card Number must be a string',
    },
    notEmpty: {
      errorMessage: 'Card Number is required',
    }
  },
  card_expiry_date: {
    in: ['body'],
    optional: true,
    isString: {
      errorMessage: 'Card Expiry Date must be a string',
    },
    notEmpty: {
      errorMessage: 'Card Expiry Date is required',
    }
  },
  card_security_code: {
    in: ['body'],
    optional: true,
    isString: {
      errorMessage: 'Card Security Code must be a string',
    },
    notEmpty: {
      errorMessage: 'Card Security Code is required',
    }
  },
  last_purchase_date: {
    in: ['body'],
    optional: true,
    isString: {
      errorMessage: 'Last Purchase Date must be a string',
    },
    notEmpty: {
      errorMessage: 'Last Purchase Date is required',
    }
  },
  total_purchases: {
    in: ['body'],
    optional: true,
    isNumeric: {
      options: { no_symbols: true },
      errorMessage: 'Total Purchases must be a number',
    },
    notEmpty: {
      errorMessage: 'Total Purchases is required',
    }
  },
  favorite_categories: {
    in: ['body'],
    optional: true,
    isString: {
      errorMessage: 'Favorite Categories must be a string',
    },
    notEmpty: {
      errorMessage: 'Favorite Categories is required',
    }
  },
  favorite_brands: {
    in: ['body'],
    optional: true,
    isString: {
      errorMessage: 'Favorite Brands must be a string',
    },
    notEmpty: {
      errorMessage: 'Favorite Brands is required',
    }
  },
  customer_reviews: {
    in: ['body'],
    optional: true,
    isString: {
      errorMessage: 'Customer Reviews must be a string',
    },
    notEmpty: {
      errorMessage: 'Customer Reviews is required',
    }
  },
}

const update: Schema = {
  uuid: {
    in: ['params'],
    isString: {
      errorMessage: 'UUID must be a string',
    },
    notEmpty: {
      errorMessage: 'UUID is required',
    }
  },
  user_id: {
    in: ['body'],
    isNumeric: {
      options: { no_symbols: true },
      errorMessage: 'UserId must be a number',
    },
    notEmpty: {
      errorMessage: 'UserId is required',
    }
  },
  shipping_address: {
    in: ['body'],
    optional: true,
    isString: {
      errorMessage: 'Shipping Address must be a string',
    },
    notEmpty: {
      errorMessage: 'Shipping Address is required',
    }
  },
  card_number: {
    in: ['body'],
    optional: true,
    isString: {
      errorMessage: 'Card Number must be a string',
    },
    notEmpty: {
      errorMessage: 'Card Number is required',
    }
  },
  card_expiry_date: {
    in: ['body'],
    optional: true,
    isString: {
      errorMessage: 'Card Expiry Date must be a string',
    },
    notEmpty: {
      errorMessage: 'Card Expiry Date is required',
    }
  },
  card_security_code: {
    in: ['body'],
    optional: true,
    isString: {
      errorMessage: 'Card Security Code must be a string',
    },
    notEmpty: {
      errorMessage: 'Card Security Code is required',
    }
  },
  last_purchase_date: {
    in: ['body'],
    optional: true,
    isString: {
      errorMessage: 'Last Purchase Date must be a string',
    },
    notEmpty: {
      errorMessage: 'Last Purchase Date is required',
    }
  },
  total_purchases: {
    in: ['body'],
    optional: true,
    isNumeric: {
      options: { no_symbols: true },
      errorMessage: 'Total Purchases must be a number',
    },
    notEmpty: {
      errorMessage: 'Total Purchases is required',
    }
  },
  favorite_categories: {
    in: ['body'],
    optional: true,
    isString: {
      errorMessage: 'Favorite Categories must be a string',
    },
    notEmpty: {
      errorMessage: 'Favorite Categories is required',
    }
  },
  favorite_brands: {
    in: ['body'],
    optional: true,
    isString: {
      errorMessage: 'Favorite Brands must be a string',
    },
    notEmpty: {
      errorMessage: 'Favorite Brands is required',
    }
  },
  customer_reviews: {
    in: ['body'],
    optional: true,
    isString: {
      errorMessage: 'Customer Reviews must be a string',
    },
    notEmpty: {
      errorMessage: 'Customer Reviews is required',
    }
  },
}

const remove: Schema = {
  uuid: {
    in: ['params'],
    notEmpty: {
      errorMessage: 'UUID is required',
    },
    isLength: {
      options: { min: 1 },
      errorMessage: 'UUID should be at least 1 chars',
    },
  },
}

export default {
  get: checkSchema(get),
  create: checkSchema(create),
  update: checkSchema(update),
  remove: checkSchema(remove),
};
