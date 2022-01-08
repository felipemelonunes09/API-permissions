const { DataTypes } = require("sequelize");
const connection = require("../../database/connection");
const { DB_FORCE } = require("../../enviroment");


const protectedRoutes = connection.define('protectedRoutes', { 
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    origin: { type: DataTypes.STRING, allowNull: false, unique: true },
    type: { type: DataTypes.ENUM, values: ['get', 'post',  'put', 'patch', 'delete', 'copy', 'head', 'options'], allowNull: false },
    private: { type: DataTypes.BOOLEAN, allowNull: false, default: true }
},
{
    paranoid: true
})

protectedRoutes.sync({ force: DB_FORCE })
module.exports = { 
    protectedRoutes
}