const sequelize = require("../config/db")


const {DataTypes} = require("sequelize");
const Clients = require("./clients.model");
const Products = require("./products.model");
const Status = require("./status.model");
const Tarif = require("./tarif.model");

const Contracts = sequelize.define("contracts", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    start_date: {
        type: DataTypes.DATE
    },
    end_date: {
        type: DataTypes.DATE
    },
    created_at: {
        type: DataTypes.DATE
    },
    total_amount: {
        type: DataTypes.DECIMAL
    },
    
},
{
    freezeTableName: true,
});

Contracts.belongsTo(Clients, {foreignKey: "client_id"})
Clients.hasMany(Contracts, {foreignKey: "client_id"})

Contracts.belongsTo(Products, {foreignKey: "product_id"})
Products.hasMany(Contracts, {foreignKey: "product_id"})

Contracts.belongsTo(Status, {foreignKey: "status_id"})
Status.hasMany(Contracts, {foreignKey: "status_id"})

Contracts.belongsTo(Tarif, {foreignKey: "tarif_id"})
Tarif.hasMany(Contracts, {foreignKey: "tarif_id"})

module.exports = Contracts