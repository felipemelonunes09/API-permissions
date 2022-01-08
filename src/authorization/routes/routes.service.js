const { deleteItem, matchCreationRightSide } = require("../../utils/modelUtils")
const HTTP = require("../../utils/statusHTTP")
const { permission } = require("../models/permission.model")
const { protectedRoutes } = require("../models/protectedRoutes.model")
const rolesToPermission = require("../models/relational/rolesToPermission.model")
const routeToPermissions = require("../models/relational/routeToPermissions.model")

class RoutesService { 

    async create(data) { 
        try {
            const result = await protectedRoutes.create(data)
            return { ...HTTP.ok(), result }
        }
        catch (e) {

            if (e.name == 'SequelizeValidationError')
                return HTTP.badRequest(e.errors)

            if (e.name == 'SequelizeUniqueConstraintError')
                return HTTP.conflict(e.errors)

            console.log(e.name)
            return HTTP.internalServer()
        }
    }

    async findOne(id) {
        try {
            const result = await protectedRoutes.findOne({ where: { id }, include: permission })
            return { ...HTTP.ok(), result }
        }
        catch (e) {
            return HTTP.internalServer()
        }
    }

    async findAll() {
        try {
            const result = await protectedRoutes.findAll({ include: permission })
            return { ...HTTP.ok(), result }
        }
        catch(e) {
            return HTTP.internalServer()
        }
    }

    async delete(id) {
        try {
            const result = await deleteItem(protectedRoutes, id, false)
            return { ...HTTP.ok('Item deleted'), result }
        }
        catch (e) {
            return HTTP.internalServer()
        }
    }

    async restore(id) {
        try {
            const result = await protectedRoutes.restore({ where: { id } })
            return { ...HTTP.ok(), result }
        }
        catch(e) {
            return HTTP.internalServer()
        }
    }

    async destroy(id) {
        try {
            const result = await deleteItem(protectedRoutes, id, true)
            return { ...HTTP.ok(), result }
        }
        catch (e) {
            return HTTP.internalServer()
        }
    }

    async update(id, data) {
        try {
            const result = await protectedRoutes.update(data, { where: { id } })
            return { ...HTTP.ok(), result }
        }
        catch (e) { 
            return HTTP.internalServer()    
        }
    }

    async attach(id, data) { 
        try {
            let route = (await this.findOne(id)).result
            if (route != undefined || route.id != undefined) { 
                await matchCreationRightSide(undefined, routeToPermissions, route.id, data, 'protectedRouteId', 'PermissionId')
                return HTTP.ok()
            }
            
            return HTTP.notFound()
        }
        catch (e) {

            if (e.name == 'SequelizeUniqueConstraintError')
                return HTTP.conflict('Keys erros the current role probably has already this permissions')

            return HTTP.internalServer()
        }
    }

    async dettach(id, data) {
        try {
            let route = (await this.findOne(id)).result
            if (route != undefined || route.id != undefined) { 
                await routeToPermissions.destroy({
                    where: {
                        protectedRouteId: route.id, 
                        PermissionId: data
                    }
                })

                return HTTP.ok()
            }

            return HTTP.notFound()
        }
        catch (e) {
            if (e.name == 'SequelizeUniqueConstraintError')
                return HTTP.conflict('Keys erros the current role probably does not have this permissions')

            console.log(e)
            return HTTP.internalServer()
        }
    }
}

module.exports = new RoutesService()