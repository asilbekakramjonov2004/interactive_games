const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");
const Clients = require("./clients.model");
const Contracts = require("./contracts.model");

const Feedbacks = sequelize.define("feedback", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    rating: {
        type: DataTypes.INTEGER, 
        validate: {
            min: 1,
            max: 5, 
        }
    },
    comment: {
        type: DataTypes.STRING(255),
        allowNull: true, 
    },
}, {
    freezeTableName: true,
});

Feedbacks.belongsTo(Clients, { foreignKey: "client_id" });
Clients.hasMany(Feedbacks, { foreignKey: "client_id" });

Feedbacks.belongsTo(Contracts, { foreignKey: "contract_id" });
Contracts.hasMany(Feedbacks, { foreignKey: "contract_id" });

module.exports = Feedbacks;
