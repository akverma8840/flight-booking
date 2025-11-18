const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Airline = sequelize.define('Airline', {
  id:{ type:DataTypes.INTEGER, primaryKey:true, autoIncrement:true },
  name: { type: DataTypes.STRING, allowNull:false },
  code: { type: DataTypes.STRING(5), allowNull:false, unique:true }
}, { tableName:'airlines', timestamps:true });

module.exports = Airline;
