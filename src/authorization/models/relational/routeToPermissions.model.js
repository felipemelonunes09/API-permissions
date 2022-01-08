const { DataTypes } = require("sequelize");
const connection = require("../../../database/connection");
const { DB_FORCE } = require("../../../enviroment");
const { permission } = require("../permission.model");
const { protectedRoutes } = require("../protectedRoutes.model");

const routeToPermissions = connection.define('routeToPermissions', { })

permission.belongsToMany(protectedRoutes, { through: routeToPermissions })
protectedRoutes.belongsToMany(permission, { through: routeToPermissions })

routeToPermissions.sync({ force: DB_FORCE })
module.exports = routeToPermissions