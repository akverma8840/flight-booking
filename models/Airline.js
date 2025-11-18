module.exports = (sequelize, DataTypes) => {
  const Airline = sequelize.define('Airline', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    code: { type: DataTypes.STRING(5), allowNull: false, unique: true },
  }, { tableName: 'airlines', timestamps: true });

  return Airline;
};
