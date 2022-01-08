require('dotenv')
.config({
    path: '../.env'
})

module.exports = {
    PORT: process.env.PORT || 8081,
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_NAME: process.env.DB_NAME || 'local_db_test',
    DB_PASSWORD: process.env.DB_PASSWORD || 'root',
    DB_USER: process.env.DB_PASSWORD || 'root',
    DB_FORCE: (process.env.DB_FORCE == 'false' ? false : false) || false
}