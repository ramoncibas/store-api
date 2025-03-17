import { Schema } from 'express-validator';

export const convertToSwaggerSchema = (schema: Schema) => {
  const swaggerSchema: any = {
    type: 'object',
    properties: {},
    required: []
  };

  for (const [key, value] of Object.entries(schema)) {
    const property: any = {
      type: 'string'
    };

    if (value.isNumeric) {
      property.type = 'integer';
    }

    if (value.notEmpty) {
      swaggerSchema.required.push(key);
    }

    swaggerSchema.properties[key] = property;
  }

  return swaggerSchema;
};