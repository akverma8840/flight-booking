const Joi = require('joi');


exports.register = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("admin", "user").default("user")
});


exports.login = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});


exports.verifyEmail = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required()
});


exports.forgotPassword = Joi.object({
  email: Joi.string().email().required()
});


exports.verifyResetOtp = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required()
});

exports.resetPassword = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required(),
  newPassword: Joi.string().min(6).required()
});
