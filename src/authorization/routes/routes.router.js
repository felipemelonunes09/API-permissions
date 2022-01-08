const express = require('express')
const routesController = require('./routes.controller')
const routeRouter = express.Router()

routeRouter.post('/', routesController.create)
routeRouter.post('/attach/:id', routesController.attach)

routeRouter.get('/', routesController.findAll)
routeRouter.get('/:id', routesController.findOne)

routeRouter.patch('/:id', routesController.update)
routeRouter.patch('/destroy/:id', routesController.delete)
routeRouter.patch('/restore/:id', routesController.restore)

routeRouter.delete('/:id', routesController.destroy)
routeRouter.delete('/detach/:id', routesController.dettach)

module.exports = routeRouter