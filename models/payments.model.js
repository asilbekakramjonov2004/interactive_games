const sequelize = require("../config/db")


const {DataTypes, ENUM} = require("sequelize");
const Contracts = require("./contracts.model");

const Payments = sequelize.define("payments", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    amount: {
        type: DataTypes.DECIMAL,
    },
    payment_date: {
        type: DataTypes.DATE,
    },
    payment_method: {
        type: DataTypes.ENUM("karta", "naqd"),
    },
    created_at: {
        type: DataTypes.DATE,
    },
    status: {
        type: DataTypes.ENUM("kutilmoqda", "to'langan", "rad etilgan")
    }
},
{
    freezeTableName: true,
});

Payments.belongsTo(Contracts, {foreignKey: "contract_id"})
Contracts.hasMany(Payments, {foreignKey: "contract_id"})


module.exports = Payments