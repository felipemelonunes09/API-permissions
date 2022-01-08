const { DataTypes } = require("sequelize");
const connection = require("../../../database/connection");
const { DB_FORCE } = require("../../../enviroment");
const { permission } = require("../permission.model");
const { role } = require("../role.model");

const rolesToPermission = connection.define('rolesToPermission', { })

role.belongsToMany(permission, { through: rolesToPermission })
permission.belongsToMany(role, { through: rolesToPermission })

rolesToPermission.sync({ force: DB_FORCE })
module.exports = rolesToPermission