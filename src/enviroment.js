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
    DB_FORCE: (process.env.DB_FORCE == 'false' ? false : false) || false,

    JWT_SECRET: (process.env.JWT_SECRET) || 'default_public_key',
    JWT_EXPIRATION: (process.env.JWT_EXPIRATION) || '1h'
}