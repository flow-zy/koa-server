import Joi from 'joi'

export const regSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(10).required(),
  password: Joi.string().pattern(new RegExp('^[a-z0-9]{3,30}$', 'i')).required(),
  confirmPassword: Joi.ref('password'),
  email: Joi.string().email(),
  phone: Joi.string().length(11),
  nickname: Joi.string(),
  avatar: Joi.string(),
  gender: Joi.number().valid(0, 1, 2),
  sort: Joi.number(),
})
export const loginSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(10).required(),
  password: Joi.string().pattern(new RegExp('^[a-z0-9]{3,30}$', 'i')).required(),
})
