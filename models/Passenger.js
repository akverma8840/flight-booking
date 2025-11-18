const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Passenger = sequelize.define('Passenger', {
  id:{ type:DataTypes.INTEGER, primaryKey:true, autoIncrement:true },
  name: { type: DataTypes.STRING, allowNull:false },
  age: { type: DataTypes.INTEGER, allowNull:false },
  gender: { type: DataTypes.STRING }
}, { tableName:'passengers', timestamps:true });

module.exports = Passenger;
