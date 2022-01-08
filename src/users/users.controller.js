const usersService = require("./users.service")

class UsersController { 

    async create(req, res) { 
        const result = await usersService.create(req.body)
        res.status(result.code).send(result)
    }
    
    async findOne(req, res) {
        const result = await usersService.findOne(req.params.id)
        res.status(result.code).send(result)
    }

    async findAll(req, res) {
        const result = await usersService.findAll()
        res.status(result.code).send(result)
    }

    async delete (req, res) { 
        const result = await usersService.delete(req.params.id)
        res.status(result.code).send(result)
    }

    async restore(req, res) { 
        const result = await usersService.restore(req.params.id)
        res.status(result.code).send(result)
    }

    async destroy(req, res) { 
        const result = await usersService.destroy(req.params.id)
        res.status(result.code).send(result)
    }

    async update(req, res) {
        const result = await usersService.update(req.params.id, req.body)
        res.status(result.code).send(result)
    }

    async assign(req, res) { 
        const result = await usersService.assign(req.params.id, req.body.roles)
        res.status(result.code).send(result)
    }

    async deassign(req, res) { 
        const result = await usersService.deassign(req.params.id, req.body.roles)
        res.status(result.code).send(result)
    }
}

module.exports = new UsersController()