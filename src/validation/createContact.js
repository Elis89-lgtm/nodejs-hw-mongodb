import Joi from 'joi';

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  phoneNumber: Joi.string().min(1).max(12).required(),
  email: Joi.string().required(),
  isFavourite: Joi.string().min(3).max(20).required(),
  //   contactType: {
  //     type: String,
  //     enum: ['work', 'home', 'personal'],
  //     required: true,
  //     default: 'personal',
  //   },
  contactType: Joi.string()
    .valid('work', 'home', 'personal')
    .default('personal')
    .required(),
});
