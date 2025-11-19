// models/index.js
const { DataTypes } = require("sequelize");
const supabase = require("../config/supabaseDB");

const User = require("./User")(supabase, DataTypes);
const Flight = require("./Flight")(supabase, DataTypes);
const Booking = require("./Booking")(supabase, DataTypes);
const Passenger = require("./Passenger")(supabase, DataTypes);
const Airline = require("./Airline")(supabase, DataTypes);

// Associations
User.hasMany(Booking, { foreignKey: "userId" });
Booking.belongsTo(User, { foreignKey: "userId" });

Flight.hasMany(Booking, { foreignKey: "flightId" });
Booking.belongsTo(Flight, { foreignKey: "flightId" });

Booking.hasMany(Passenger, { foreignKey: "bookingId" });
Passenger.belongsTo(Booking, { foreignKey: "bookingId" });

Airline.hasMany(Flight, { foreignKey: "airlineId" });
Flight.belongsTo(Airline, { foreignKey: "airlineId" });

module.exports = { supabase, User, Flight, Booking, Passenger, Airline };
