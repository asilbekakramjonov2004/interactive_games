const sequelize = require("../config/db")


const {DataTypes} = require("sequelize")

const Clients = sequelize.define("clients", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    first_name: {
        type: DataTypes.STRING(30),
    },
    last_name: {
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
        type: DataTypes.STRING(1000)
    },
    phone_number: {
        type: DataTypes.STRING(15),
        validate: {
            is: /^\d{2}-\d{3}-\d{2}-\d{2}$/
        }
    },
    passport: {
        type: DataTypes.STRING(20)
    },
    address: {
        type: DataTypes.STRING(255)
    },
    registration_date: {
        type: DataTypes.DATE
    },
    refresh_token: {
        type: DataTypes.STRING(1000)
    },
    is_active: {
        type: DataTypes.BOOLEAN
    },

    activation_link: {
        type: DataTypes.STRING(1000),
    },
},
{
    freezeTableName: true,
});

module.exports = Clients