const CONST = require("../constants/appConstants");

module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "User",
    {
      id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
      },

      name: { 
        type: DataTypes.STRING, 
        allowNull: false 
      },

      email: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        unique: true 
      },

      password: { 
        type: DataTypes.STRING, 
        allowNull: false 
      },

      role: {
        type: DataTypes.ENUM(CONST.ROLES.USER, CONST.ROLES.ADMIN),
        defaultValue: CONST.ROLES.USER,
      },

      //Email Verification fields
      isVerified: { 
        type: DataTypes.BOOLEAN, 
        defaultValue: false 
      },

      emailOtp: { 
        type: DataTypes.STRING, 
        allowNull: true 
      },

      emailOtpExpiry: { 
        type: DataTypes.DATE, 
        allowNull: true 
      },

      // Forgot Password fields
      resetOtp: { 
        type: DataTypes.STRING, 
        allowNull: true 
      },

      resetOtpExpiry: { 
        type: DataTypes.DATE, 
        allowNull: true 
      },
    },
    {
      tableName: "Users",
      timestamps: true,
    }
  );
};
