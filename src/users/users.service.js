const rolesToUser = require('../authorization/models/relational/rolesToUser.model')
const { deleteItem, matchCreationRightSide } = require('../utils/modelUtils')
const HTTP = require('../utils/statusHTTP')
const user = require('./models/users.model')

class UsersService {

    async create(data) { 
        try {
            const result = await user.create(data)
            return { ...HTTP.ok(), result }
        }
        catch (e) {
            console.log(e)
            return HTTP.internalServer()            
        }
    }
    
    async findOne(id) { 
        try {
            const result = await user.findOne({ where: { id } })
            return { ...HTTP.ok(), result }
        }
        catch (e) { 
            return HTTP.internalServer()
        }
    }

    async findAll() { 
        try {
            const result = await user.findAll()
            return { ...HTTP.ok(), result }
        }
        catch (e) {
            return HTTP.internalServer()
        }
    }

    async delete(id) { 
        try {
            await deleteItem(user, id, false)
            return HTTP.ok() 
        }
        catch (e) {
            return HTTP.internalServer()
        }
    }

    async restore(id) { 
        try {
            const result = user.restore({ where: { id }})
            return { ...HTTP.ok(), result }
        }
        catch (e) {
            return HTTP.internalServer()
        }
    }

    async destroy(id) { 
        try {
            await deleteItem(user, id, true)
            return HTTP.ok() 
        }
        catch(e) {
            return HTTP.internalServer()
        }
    }


    async update(id, data) {
        try {
            const result = await user.update(data, { where: { id }})
            return { ...HTTP.ok(), result }
        }
        catch(e) {
            return HTTP.internalServer()
        }
     }

     async assign(id, data) { 
         try {
            console.log({ id, data})
            let user = (await this.findOne(id)).result
            if (user != undefined || user.id != undefined) {
                await matchCreationRightSide(undefined, rolesToUser, user.id, data, 'userId', 'RoleId')
                return HTTP.ok()
            }

            return HTTP.notFound()
         }
         catch(e) {
            if (e.name == 'SequelizeUniqueConstraintError')
                return HTTP.conflict('Keys erros the current role probably does not have this permissions')

            console.log(e)
            return HTTP.internalServer()
         }
     }

     async deassign(id, data) { 
        try {
            let user = (await this.findOne(id)).result
            if (user != undefined || user.id != undefined) {
                await rolesToUser.destroy({
                    where: {
                        userId: user.id,
                        RoleId: data
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

module.exports = new UsersService()