const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('products_db', 'root', 'password', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;