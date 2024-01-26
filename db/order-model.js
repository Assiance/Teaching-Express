const { DataTypes } = require('sequelize');
const sequelize = require('./data-connection');

const Orders = sequelize.define('orders', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        min: 1,
    }
});

module.exports = Orders;