const express = require('express')
const { permission } = require('../models/permission.model')
const { role } = require('../models/role.model')
const rolesController = require('./roles.controller')
const roleRouter = express.Router()

roleRouter.get('/:id', rolesController.findOne)
roleRouter.get('/', rolesController.findAll)

roleRouter.post('/', rolesController.create)
roleRouter.post('/attach/:id', rolesController.attach)

roleRouter.patch('/:id', rolesController.update)

roleRouter.patch('/destroy/:id', rolesController.delete)
roleRouter.patch('/restore/:id', rolesController.restore)

roleRouter.delete('/:id', rolesController.destroy)
roleRouter.delete('/detach/:id', rolesController.detach)


module.exports = roleRouter