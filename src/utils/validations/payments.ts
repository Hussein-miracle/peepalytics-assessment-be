import Joi from 'joi';

export const paymentProcessingSchema = Joi.object({
  amount: Joi.number().positive().required().messages({
    'number.base': 'Amount must be a number.',
    'number.positive': 'Amount must be a positive number.',
    'any.required': 'Amount is required.',
  }),
  currency: Joi.string().length(3).uppercase().required().messages({
    'string.base': 'Currency must be a string.',
    'string.length': 'Currency must be a 3-letter code.',
    'any.required': 'Currency is required.',
  }),
  sourceId: Joi.string().required().messages({
    'string.base': 'Source ID must be a string.',
    'any.required': 'Source ID is required.',
  }),
});


export const paymentRetrievalSchema = Joi.object({
  payment_id: Joi.string()
    .required()
    .messages({
      'string.base': 'Payment ID must be a string.',
      'any.required': 'Payment ID is required.',
    }),
});