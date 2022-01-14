const bodyParser = require('body-parser')
const express = require('express');
const { AuthModule } = require('./authorization/AuthModule');
const permissionRouter = require('./authorization/permissions/permissions.router');
const permissionsService = require('./authorization/permissions/permissions.service');
const roleRouter = require('./authorization/roles/roles.router');
const rolesService = require('./authorization/roles/roles.service');
const routeRouter = require('./authorization/routes/routes.router');
const routesService = require('./authorization/routes/routes.service');
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

AuthModule().configAndProtect(app, {
    role: rolesService,
    permission: permissionsService,
    route: routesService
},{
    role: roleRouter,
    permission: permissionRouter,
    route: routeRouter
})

app.use('/users', routerUser)


module.exports = app

/* 
    My api especification -

    ALL real delete have to be perform by a full adm user 
*/