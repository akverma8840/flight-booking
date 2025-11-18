const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres",
    port: process.env.DB_PORT || 5432,
    logging: false,
  }
);

const User = require("./User")(sequelize, DataTypes);
const Flight = require("./Flight")(sequelize, DataTypes);
const Booking = require("./Booking")(sequelize, DataTypes);
const Passenger = require("./Passenger")(sequelize, DataTypes);
const Airline = require("./Airline")(sequelize, DataTypes);

// Associations
User.hasMany(Booking, { foreignKey: "userId" });
Booking.belongsTo(User, { foreignKey: "userId" });

Flight.hasMany(Booking, { foreignKey: "flightId" });
Booking.belongsTo(Flight, { foreignKey: "flightId" });

Booking.hasMany(Passenger, { foreignKey: "bookingId" });
Passenger.belongsTo(Booking, { foreignKey: "bookingId" });

module.exports = { sequelize, Sequelize, User, Flight, Booking, Passenger, Airline };
