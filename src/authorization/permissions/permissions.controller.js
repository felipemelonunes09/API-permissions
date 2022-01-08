const permissionsService = require("./permissions.service")

class PermissionController {

    async create(req, res) { 
        const result = await permissionsService.create(req.body)
        res.status(result.code).send(result)
    }

    async findOne(req, res) {
        const result = await permissionsService.findOne(req.params.id)
        res.status(result.code).send(result)
    }

    async findAll(req, res) { 
        const result = await permissionsService.findAll()
        res.status(result.code).send(result)
    }

    async delete(req, res) { 
        const result = await permissionsService.delete(req.params.id)
        res.status(result.code).send(result)
    }
    async restore(req, res) {
        const result = await permissionsService.restore(req.params.id)
        res.status(result.code).send(result)
     }

    async destroy(req, res) { 
        const result = await permissionsService.destroy(req.params.id)
        res.status(result.code).send(result)
    }

    async update(req, res) {
        const result = await permissionsService.update(req.params.id, req.body)
        res.status(result.code).send(result)
    }
}

module.exports = new PermissionController()