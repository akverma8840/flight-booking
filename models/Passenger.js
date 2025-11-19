module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Passenger", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    bookingId: { type: DataTypes.INTEGER },
    name: { type: DataTypes.STRING },
    age: { type: DataTypes.INTEGER },
    gender: { type: DataTypes.STRING },
  });
};
