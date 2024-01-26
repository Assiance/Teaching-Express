const { DataTypes } = require('sequelize');
const sequelize = require('./data-connection');
const Orders = require('./order-model');

const Products = sequelize.define('products', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(64),
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.STRING(256)
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        min: 1,
    }
});

Products.hasMany(Orders);
Orders.belongsTo(Products);

module.exports = Products;