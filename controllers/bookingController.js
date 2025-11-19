const { supabase, Flight, Booking, Passenger } = require("../models");
const msg = require("../messages/responses");
const STATUS = require("../constants/statusCodes");
const CONST = require("../constants/appConstants");

exports.createBooking = async (req, res, next) => {
  const t = await supabase.transaction();

  try {
    const { flightId, passengers, paymentMethod } = req.body;

    const flight = await Flight.findOne({
      where: { id: flightId },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!flight)
      return res.status(STATUS.NOT_FOUND).json({ message: msg.flight.notFound });

    if (flight.availableSeats < passengers.length)
      return res.status(STATUS.BAD_REQUEST).json({
        message: msg.booking.insufficientSeats,
      });

    const totalAmount = flight.price * passengers.length;
    const bookingRef = "BK" + Date.now();

    const booking = await Booking.create(
      {
        userId: req.user.id,
        flightId,
        totalAmount,
        paymentMethod,
        status: CONST.BOOKING_STATUS.PENDING,
        bookingRef,
      },
      { transaction: t }
    );

    for (const p of passengers) {
      await Passenger.create(
        {
          bookingId: booking.id,
          name: p.name,
          age: p.age,
          gender: p.gender,
        },
        { transaction: t }
      );
    }

    await flight.update(
      { availableSeats: flight.availableSeats - passengers.length },
      { transaction: t }
    );

    booking.status = CONST.BOOKING_STATUS.CONFIRMED;
    await booking.save({ transaction: t });

    await t.commit();

    return res.status(STATUS.CREATED).json({
      message: msg.booking.confirmed,
      bookingRef,
      totalAmount,
    });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};
