const express = require('express')
const usersController = require('./users.controller')
const routerUser = express.Router()

routerUser.post('/', usersController.create)
routerUser.post('/assign/:id', usersController.assign)

routerUser.get('/', usersController.findAll)
routerUser.get('/:id', usersController.findOne)

routerUser.patch('/:id', usersController.update)
routerUser.patch('/destroy/:id', usersController.delete)
routerUser.patch('/restore/:id', usersController.restore)

routerUser.delete('/:id', usersController.destroy)
routerUser.delete('/deassign/:id', usersController.deassign)

module.exports = routerUser