const { DataTypes } = require("sequelize");
const { DB_FORCE } = require("../../enviroment");
const connection = require("../../database/connection");
const bcrypt = require('bcrypt')

const user = connection.define('users', {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { 
        type: DataTypes.STRING, 
        allowNull: false,  
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: { 
        type: DataTypes.STRING, 
        allowNull: false,
        set (value) { 
            
            const saltsRound = 15;
            const hash = bcrypt.hashSync(value, saltsRound)

            this.setDataValue('password', hash)
        }
    }
},
{
    paranoid: true
})

user.sync({ force: DB_FORCE })
module.exports = user


// Remender tu user set and get sequelize to hash the password