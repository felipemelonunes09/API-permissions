const { deleteItem } = require("../../utils/modelUtils");
const HTTP = require("../../utils/statusHTTP");
const { permission } = require("../models/permission.model");

class PermissionService { 

    async create(data) { 
        try {
            const result = await permission.create(data)
            return { ...HTTP.ok('permission created'), result: result.dataValues.id }

        }  catch (e) {
            if (e.name = 'SequelizeValidationError')
                return HTTP.badRequest(e.errors)

            return HTTP.internalServer(e);
        }
    }

    async findOne(id) { 
        try {
            const result = await permission.findByPk(id)
            return { ...HTTP.ok(), result  }
        }
        catch(e) {
            return HTTP.internalServer()
        }
    }

    async findAll() {
        try {
            const result = await permission.findAll()
            return { ...HTTP.ok(), result } 
        } catch (e) {
            return HTTP.internalServer()
        }
    }
    
    async delete(id) { 
        try {
            const result = await deleteItem( permission, id, false )
            return { ...HTTP.ok(), result }
        }
        catch(e) {
            return HTTP.internalServer()
        }
    }

    async restore(id) { 
        try {
            const result = await permission.restore({ where: { id } })
            return { ...HTTP.ok(), result }
        }
        catch (e) {
            return HTTP.internalServer()
        }
    }

    async destroy(id) { 
        try {
            const result = await deleteItem(permission, id, true)
            return { ...HTTP.ok(), result }
        }
        catch(e) {
            return HTTP.internalServer()
        }
    }

    async update(id, data) { 
        try {
            const result = await permission.update(data, { where: { id } })
            return { ...HTTP.ok(), result }
        }
        catch(e) {
            return HTTP.internalServer()
        }
    }
}



module.exports = new PermissionService()