import Joi from 'joi';

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.string.min(1).max(12),
  email: Joi.string(),
  isFavourite: Joi.string().min(3).max(20),
  contactType: {
    type: String,
    enum: ['work', 'home', 'personal'],

    default: 'personal',
  },
});
