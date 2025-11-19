const CONST = require("../constants/appConstants");



module.exports = (sequelize, DataTypes) => {
  return sequelize.define("User", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: {
  type: DataTypes.ENUM(CONST.ROLES.USER, CONST.ROLES.ADMIN),
  defaultValue: CONST.ROLES.USER,
},
  });
};
