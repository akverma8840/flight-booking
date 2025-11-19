const CONST = require("../constants/appConstants");

module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define("Booking", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    flightId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    bookingDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

    seats: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    // 🔥 FIXED: No ENUM — simple STRING
    status: {
      type: DataTypes.STRING,
      defaultValue: CONST.BOOKING_STATUS.PENDING
    },

    bookingRef: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });

  return Booking;
};
