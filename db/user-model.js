const { DataTypes } = require('sequelize');
const sequelize = require('./data-connection');
const bcrypt = require('bcrypt');

const Users = sequelize.define('users', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    first_name: {
        type: DataTypes.STRING(64),
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING(64),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(256),
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING(256),
        allowNull: false,
    }
}, {
    hooks: {
        // Hook that runs whenever User is created or updated
        beforeSave: async (user, options) => {
            //if user is a new record or password has been updated
            if (user.isNewRecord || user.changed('password')) {
                const saltRounds = 10;
                user.password = await bcrypt.hash(user.password, saltRounds);
            }
        }
    }
});

module.exports = Users;