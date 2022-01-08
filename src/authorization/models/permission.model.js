const { DataTypes } = require("sequelize");
const connection = require("../../database/connection");
const { DB_FORCE } = require("../../enviroment");


const permission = connection.define('Permissions', {
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    birthRight: { type: DataTypes.BOOLEAN, allowNull: false, default: false }

}, {
    paranoid: true
})

permission.sync({ force: DB_FORCE })

module.exports = {
    permission
}