const sequelize = require("../config/db")


const {DataTypes} = require("sequelize")

const Admins = sequelize.define("admins", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(30),
    },
    email: {
        type: DataTypes.STRING(100),
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING
    },
    phone_number: {
        type: DataTypes.STRING(15),
        validate: {
            is: /^\d{2}-\d{3}-\d{2}-\d{2}$/
        }
    },
    is_active: {
        type: DataTypes.BOOLEAN
    },
    is_creator: {
        type: DataTypes.BOOLEAN
    },
    refresh_token: {
        type: DataTypes.STRING(1000)
    }
},
{
    freezeTableName: true,
});

module.exports = Admins