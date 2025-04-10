const sequelize = require("../config/db")


const {DataTypes} = require("sequelize");
const Owners = require("./owners.model");
const Categories = require("./categories.model");

const Products = sequelize.define("prod", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(30),
    },
    description: {
        type: DataTypes.STRING(255),
    },
    price_per_day: {
        type: DataTypes.DECIMAL,
    },
    is_active: {
        type: DataTypes.BOOLEAN,
    },
    
},
{
    freezeTableName: true,
});

Products.belongsTo(Owners, { foreignKey: "owner_id" });
Owners.hasMany(Products, { foreignKey: "owner_id" });

Products.belongsTo(Categories, { foreignKey: "category_id" });
Categories.hasMany(Products, { foreignKey: "category_id" });

module.exports = Products