const Joi = require('joi');
exports.createBooking = Joi.object({
  flightId: Joi.number().integer().required(),
  passengers: Joi.array().items(Joi.object({
    name: Joi.string().required(),
    age: Joi.number().integer().min(0).required(),
    gender: Joi.string().valid('male','female','other').optional()
  })).min(1).required(),
  paymentMethod: Joi.string().valid('card','upi','netbanking').required()
});
