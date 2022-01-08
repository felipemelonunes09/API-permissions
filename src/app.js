const bodyParser = require('body-parser')
const express = require('express');
const { AuthModule } = require('./authorization/AuthModule');
const routerUser = require('./users/users.router');


const app = express();


// Config
    app.use( bodyParser.urlencoded({ extended: true }) )
    app.use( bodyParser.json() )

app.get('/', (req, res) => {
    res.status(200).send({
        title: `Permissioned API running`,
        status: true
    })
})

AuthModule().config(app)

app.use('/users', routerUser)

module.exports = app

/* 
    My api especification -

    ALL real delete have to be perform by a full adm user 
*/