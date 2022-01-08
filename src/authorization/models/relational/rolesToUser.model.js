const { DataTypes } = require("sequelize");
const connection = require("../../../database/connection");
const { DB_FORCE } = require("../../../enviroment");
const user = require("../../../users/models/users.model");
const { role } = require("../role.model");

const rolesToUser = connection.define('rolesToUser', { })

role.belongsToMany(user, { through: rolesToUser })
user.belongsToMany(role, { through: rolesToUser })

rolesToUser.sync({ force: DB_FORCE })
module.exports = rolesToUser