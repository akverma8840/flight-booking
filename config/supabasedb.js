// config/supabaseDB.js
const { Sequelize } = require("sequelize");
require("dotenv").config();

const supabase = new Sequelize(
  process.env.SUPABASE_DB_NAME,      
  process.env.SUPABASE_DB_USER,      
  process.env.SUPABASE_DB_PASSWORD,  
  {
    host: process.env.SUPABASE_DB_HOST, 
    dialect: "postgres",
    port: 5432,
    logging: false,
    dialectOptions: {
      ssl: { require: true, rejectUnauthorized: false }
    }
  }
);

module.exports = supabase;
