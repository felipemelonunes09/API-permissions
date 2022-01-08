const rolesService = require("./roles.service")


class RolesController { 

    async create(req, res) { 
        const result = await rolesService.create(req.body)
        res.status(result.code).send(result)
    }

    async findOne(req, res) { 
        const result = await rolesService.findOne(req.params.id)
        res.status(result.code).send(result)
    }

    async findAll(req, res) { 
        const result = await rolesService.findAll()
        res.status(result.code).send(result)
     }

    async delete(req, res) { 
        const result = await rolesService.delete(req.params.id)
        res.status(result.code).send(result)
    }

    async restore(req, res) { 
        const result = await rolesService.restore(req.params.id)
        res.status(result.code).send(result)
    }

    async destroy(req, res) {
        const result = await rolesService.destroy(req.params.id)
        res.status(result.code).send(result)
    }

    async update(req, res) {
        const result = await rolesService.update(req.params.id, req.body)
        res.status(result.code).send(result)
    }

    async attach(req, res) {
        const result = await rolesService.attach(req.params.id, req.body.permissions)
        res.status(result.code).send(result)
    }

    async detach(req, res) {
        const result = await rolesService.detach(req.params.id, req.body.permissions)
        res.status(result.code).send(result)
    }
    
}

module.exports = new RolesController()