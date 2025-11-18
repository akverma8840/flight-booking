const { sequelize, Flight, Booking, Passenger } = require("../models");
const redis = require("../redisClient");
const Joi = require("joi");

const bookingSchema = Joi.object({
  flightId: Joi.number().required(),
  passengers: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      age: Joi.number().required(),
      gender: Joi.string().valid("M", "F").required(),
    })
  ).min(1).required(),
  paymentMethod: Joi.string().required()
});

exports.createBooking = async (req, res, next) => {
  const { error } = bookingSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const t = await sequelize.transaction();
  try {
    const userId = req.user.id;
    const { flightId, passengers, paymentMethod } = req.body;
    const seatsNeeded = passengers.length;

    // Redis Lock Key (Prevents concurrent users)
    const redisLockKey = `flight_booking_lock:${flightId}`;

    // Attempt to acquire lock (value doesn't matter, EX=5 means auto expire)
    const lockAcquired = await redis.set(redisLockKey, userId, "NX", "EX", 5);
    if (!lockAcquired) {
      return res.status(409).json({ message: "Flight is currently being booked. Try again." });
    }

    // Fetch flight row with FOR UPDATE lock
    const flight = await Flight.findOne({
      where: { id: flightId },
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (!flight) throw new Error("Flight not found");

    if (flight.availableSeats < seatsNeeded) {
      throw new Error("Not enough seats available");
    }

    const totalAmount = flight.price * seatsNeeded;

    const bookingRef = `BK${Date.now()}${Math.floor(Math.random() * 1000)}`;

    const booking = await Booking.create({
      userId,
      flightId,
      totalAmount,
      paymentMethod,
      status: "pending", // will upgrade later
      bookingRef
    }, { transaction: t });

    for (const p of passengers) {
      await Passenger.create({
        bookingId: booking.id,
        name: p.name,
        age: p.age,
        gender: p.gender
      }, { transaction: t });
    }

    // deduct seats
    await flight.update({
      availableSeats: flight.availableSeats - seatsNeeded
    }, { transaction: t });

    // Simulate payment success
    booking.status = "confirmed";
    await booking.save({ transaction: t });

    await t.commit();
    await redis.del(redisLockKey);

    return res.status(201).json({
      message: "Booking confirmed",
      bookingRef,
      totalAmount
    });

  } catch (err) {
    await t.rollback();
    next(err);
  }
};
