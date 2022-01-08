const routesService = require("./routes.service")

class RoutesController { 

    async create(req, res) { 
        const result = await routesService.create(req.body)
        res.status(result.code).send(result)
    }

    async findOne(req, res) { 
        const result = await routesService.findOne(req.params.id)
        res.status(result.code).send(result)
    }

    async findAll(req, res) { 
        const result = await routesService.findAll()
        res.status(result.code).send(result)
    }
    
    async delete(req, res) { 
        const result = await routesService.delete(req.params.id)
        res.status(result.code).send(result)
    }
    async restore(req, res) { 
        const result = await routesService.restore(req.params.id)
        res.status(result.code).send(result)
    }

    async destroy(req, res) {
        const result = await routesService.destroy(req.params.id)
        res.status(result.code).send(result)
    }

    async update(req, res) {
        const result = await routesService.update(req.params.id, req.body)
        res.status(result.code).send(result)
    }

    async attach(req, res) { 
        const result = await routesService.attach(req.params.id, req.body.permissions)
        res.status(result.code).send(result)
    }
    
    async dettach(req, res) {
        const result = await routesService.dettach(req.params.id, req.body.permissions)
        res.status(result.code).send(result)    
    }
}

module.exports = new RoutesController()