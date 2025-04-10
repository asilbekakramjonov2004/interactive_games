const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Tarif = sequelize.define("tarif", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
  discount_percent: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  freezeTableName: true,
});

module.exports = Tarif;
