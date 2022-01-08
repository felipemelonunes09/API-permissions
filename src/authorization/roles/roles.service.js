const { Op } = require("sequelize")
const connection = require("../../database/connection")
const { deleteItem, matchCreationRightSide } = require("../../utils/modelUtils")
const HTTP = require("../../utils/statusHTTP")
const { permission } = require("../models/permission.model")
const rolesToPermission = require("../models/relational/rolesToPermission.model")
const { role } = require("../models/role.model")
const permissionsService = require("../permissions/permissions.service")

class RolesService { 

    
    async create(data) { 
        try {
            if (data.permissions == undefined) 
                return HTTP.badRequest('Role without permissions')

            const new_role = await role.create(data)
            const id = new_role.dataValues.id

            await matchCreationRightSide(permissionsService, rolesToPermission, id, data.permissions, 'RoleId', 'PermissionId', 'name')        
            return HTTP.ok('Role created')

        } 
        catch (e) {
            if (e.name == 'SequelizeValidationError')
                return HTTP.badRequest(e.errors)

            console.log(e)
            return HTTP.internalServer(e)
        }
    }

    async findOne(id) { 
        try {
            if (id == null)
                return HTTP.badRequest('Id null')
             
            const result = await role.findOne({ 
                where: { id },
                include: permission
            })

            return { ...HTTP.ok(), result }
        }   
        catch(e) {
            console.log(e)
            return HTTP.internalServer()
        }
    }

    async findAll() {
        try {
            const result = await role.findAll({ include: permission })
            return { ...HTTP.ok(), result}
        }
        catch (e) {
            return HTTP.internalServer()
        }
    }

    async delete(id) {
        try {
            const result = await deleteItem( role, id, false )
            return HTTP.ok('Item deleted')
        }
        catch(e) {
            return HTTP.internalServer()
        }
    }

    async restore(id) {
        try {
            const result = await role.restore({ where: { id } })
            return { ...HTTP.ok(), result }
        }
        catch (e){
            return HTTP.internalServer()
        }
     }

    async destroy(id) { 
        try { 
            const result = await deleteItem(role, id, true)
            return { ...HTTP.ok(), result }
        }
        catch (e) {
            return HTTP.internalServer()
        }
    }

    async update(id, data) {
        try {
            const result = await role.update(data, { where: { id }})
            return { ...HTTP.ok(), result } 
        }
        catch (e) {
            console.log()
            return HTTP.internalServer()
        }
     }

    async attach(id, data) { 
        try {
            if (!Array.isArray(data)) 
                return HTTP.badRequest('Data shoud be array')
            
            let role = (await this.findOne(id)).result
            if (role != undefined || role.id != undefined) {
                await matchCreationRightSide(undefined, rolesToPermission, role.id, data, 'RoleId', 'PermissionId', 'name')
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

    async detach(id, data) { 
        try {
            if (!Array.isArray(data))
                return HTTP.badRequest('Data')

            let role = (await this.findOne(id)).result
            if (role != undefined || role.id != undefined) {
                await rolesToPermission.destroy({ 
                    where: {             
                        RoleId: role.id,
                        PermissionId: data
                    }
                })
                return HTTP.ok()
            }

            return HTTP.notFound()
        }
        catch(e) {
            if (e.name == 'SequelizeUniqueConstraintError')
                return HTTP.conflict('Keys erros the current role probably does not have this permissions')

            return HTTP.internalServer()
        }
    }
}


module.exports = new RolesService()