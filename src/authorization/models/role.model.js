const { DataTypes } = require("sequelize");
const connection = require("../../database/connection");
const { DB_FORCE } = require("../../enviroment");
const { permission } = require("./permission.model");

const role = connection.define('Roles', {
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    birthRight: { type: DataTypes.BOOLEAN, allowNull: false, default: false }
}, {
    paranoid: true
})

role.sync({ force: DB_FORCE })

module.exports = {
    role
}