const Joi = require('joi');
exports.createFlight = Joi.object({
  airlineId: Joi.number().integer().required(),
  flightNumber: Joi.string().required(),
  origin: Joi.string().required(),
  destination: Joi.string().required(),
  departureAt: Joi.date().required(),
  arrivalAt: Joi.date().required(),
  totalSeats: Joi.number().integer().min(1).required(),
  price: Joi.number().positive().required()
});
