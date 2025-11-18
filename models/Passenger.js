module.exports = (sequelize, DataTypes) => {
  const Passenger = sequelize.define('Passenger', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    bookingId: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    age: { type: DataTypes.INTEGER, allowNull: false },
    gender: { type: DataTypes.STRING },
  }, { tableName: 'passengers', timestamps: true });

  return Passenger;
};
