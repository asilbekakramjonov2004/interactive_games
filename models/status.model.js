const sequelize = require("../config/db")


const {DataTypes} = require("sequelize")

const Status = sequelize.define("status", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(30),
    },
    
},
{
    freezeTableName: true,
});

module.exports = Status