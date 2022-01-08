const Sequelize = require('sequelize')
const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST } = require('../enviroment')

const connection = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: 'mysql'
})

module.exports = connection