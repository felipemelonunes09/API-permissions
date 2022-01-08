const { DataTypes } = require("sequelize");
const connection = require("../../database/connection");
const { DB_FORCE } = require("../../enviroment");
const bcrypt = require('bcrypt')

const user = connection.define('users', {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { 
        type: DataTypes.STRING, 
        allowNull: false,  
        unique: true,
        validate: {
            isEmail: true
        },
        set: (value) => {
            const saltsRound = 15;
            bcrypt.hash(value, saltsRound).then((hash) => {
                this.setDataValue('password', hash)
            })
        }
    },
    password: { type: DataTypes.STRING, allowNull: false }
},
{
    paranoid: true
})

user.sync({ force: DB_FORCE })
module.exports = user


// Remender tu user set and get sequelize to hash the password