const { Flight, Airline } = require('../models');
const { createFlight } = require('../validators/flight');

exports.createFlight = async (req, res, next) => {
  const { error } = createFlight.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  try {
    const { airlineId, flightNumber, origin, destination, departureAt, arrivalAt, totalSeats, price } = req.body;
    const f = await Flight.create({ airlineId, flightNumber, origin, destination, departureAt, arrivalAt, totalSeats, availableSeats: totalSeats, price });
    res.status(201).json(f);
  } catch (err) { next(err); }
};

exports.searchFlights = async (req, res, next) => {
  try {
    const { origin, destination, date, page=1, limit=10 } = req.query;
    const where = {};
    if (origin) where.origin = origin;
    if (destination) where.destination = destination;
    if (date) {
      const dayStart = new Date(date); dayStart.setHours(0,0,0,0);
      const dayEnd = new Date(date); dayEnd.setHours(23,59,59,999);
      where.departureAt = { $gte: dayStart, $lte: dayEnd }; // Sequelize v6: use Op
    }
    // using Sequelize operators properly:
    const { Op } = require('sequelize');
    if (date) where.departureAt = { [Op.between]: [new Date(date+'T00:00:00'), new Date(date+'T23:59:59')] };

    const flights = await Flight.findAndCountAll({
      where,
      include: [{ model: Airline, attributes: ['name','code'] }],
      limit: parseInt(limit), offset: (page-1)*limit,
      order: [['departureAt', 'ASC']]
    });
    res.json({ total: flights.count, flights: flights.rows });
  } catch (err) { next(err); }
};
