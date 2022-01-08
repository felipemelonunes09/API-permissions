const express = require('express')
const permissionsController = require('./permissions.controller')
const permissionRouter = express.Router()

permissionRouter.get('/', permissionsController.findAll)
permissionRouter.get('/:id', permissionsController.findOne)

permissionRouter.post('/', permissionsController.create)

permissionRouter.patch('/:id', permissionsController.update)
permissionRouter.patch('/destroy/:id', permissionsController.delete)
permissionRouter.patch('/restore/:id', permissionsController.restore)

permissionRouter.delete('/:id', permissionsController.destroy)

module.exports = permissionRouter