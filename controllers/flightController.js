const { Flight, Airline } = require("../models");
const msg = require("../messages/responses");
const STATUS = require("../constants/statusCodes");
const { Op } = require("sequelize");

exports.createFlight = async (req, res, next) => {
  try {
    const flight = await Flight.create({
      airlineId: req.body.airlineId,
      flightNumber: req.body.flightNumber,
      origin: req.body.origin,
      destination: req.body.destination,
      departureTime: req.body.departureAt,
      arrivalTime: req.body.arrivalAt,
      totalSeats: req.body.totalSeats,
      availableSeats: req.body.totalSeats,
      price: req.body.price,
    });

    return res.status(STATUS.CREATED).json({
      message: msg.flight.created,
      flight,
    });
  } catch (err) {
    next(err);
  }
};

exports.searchFlights = async (req, res, next) => {
  try {
    const where = {};

    if (req.query.origin) where.origin = req.query.origin;
    if (req.query.destination) where.destination = req.query.destination;

    if (req.query.date) {
      where.departureTime = {
        [Op.between]: [
          new Date(req.query.date + "T00:00:00"),
          new Date(req.query.date + "T23:59:59"),
        ],
      };
    }

    const flights = await Flight.findAndCountAll({
      where,
      include: [{ model: Airline }],
    });

    if (flights.count === 0)
      return res.status(STATUS.NOT_FOUND).json({ message: msg.flight.notFound });

    return res.status(STATUS.OK).json({
      total: flights.count,
      flights: flights.rows,
    });
  } catch (err) {
    next(err);
  }
};
