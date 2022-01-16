const rolesToUser = require('../authorization/models/relational/rolesToUser.model')
const { deleteItem, matchCreationRightSide } = require('../utils/modelUtils')
const HTTP = require('../utils/statusHTTP')
const user = require('./models/users.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRATION } = require('../enviroment')
const { permission } = require('../authorization/models/permission.model')
const { role } = require('../authorization/models/role.model')
const rolesService = require('../authorization/roles/roles.service')

const generateUserToken = async (user) => {

    console.log("test")

    let { id, email } = user
    
    const token = await jwt.sign({ id, email }, JWT_SECRET, { expiresIn: JWT_EXPIRATION })
    console.log(token)
    return token
}


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
    
    async findOne(id, attributes, where = { }) { 
        try {

            const result = await user.findOne({ where: { id, ...where }, attributes, include: [role] })
            
            if (result == undefined) 
                return HTTP.notFound()
            
            // warning find one is doing too much
            const roles = result.Roles
            let permissions = []

            for (let index = 0; index < roles.length; index++) {
                let role = (await rolesService.findOne(roles[index].id)).result
                permissions = [ ...permissions, ...role.Permissions ]
            }
        
            result.dataValues['mappedPermissions'] = [...new Set(permissions)]
            return { ...HTTP.ok(), result }
        }
        catch (e) { 
            console.log(e)
            return HTTP.internalServer()
        }
    }

    async findByEmail(email) {
        try {
            const result = await user.findOne({ where: { email } })
            return { ...HTTP.ok(), result }
        }
        catch (e) {
            return HTTP.internalServer()
        }
    }

    async findAll(attributes) { 
        try {
            const result = await user.findAll({ attributes })
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
            if (user != undefined) {
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

    async login(email, password) { 
        try {
            if (email == undefined || password == undefined)
                return HTTP.badRequest()

            const _user = (await this.findByEmail(email)).result;
            if (_user != undefined) {
                const match = await bcrypt.compare(password, _user.password)
                if(match) {
                    return {
                        ...HTTP.ok(),
                        token: await generateUserToken(_user)
                    }
                }
                return HTTP.unauthorized()
            }
            return HTTP.notFound()
        }
        catch {
            return HTTP.internalServer()
        }
    }
}

module.exports = new UsersService()