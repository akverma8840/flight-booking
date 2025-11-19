module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Airline", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING },
    code: { type: DataTypes.STRING },
  });
};
