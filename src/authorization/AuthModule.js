const rolesToPermission = require("./models/relational/rolesToPermission.model")
const rolesToUser = require("./models/relational/rolesToUser.model")
const routeToPermissions = require("./models/relational/routeToPermissions.model")

const permissionRouter = require("./permissions/permissions.router")
const roleRouter = require("./roles/roles.router")
const routeRouter = require("./routes/routes.router")

const AuthModule = () => {
    
    const config = (app, config) => {
        app.use('/permissions', permissionRouter)        
        app.use('/roles', roleRouter)
        app.use('/routes', routeRouter)
    }
    
    
    return { config }
}

module.exports = { AuthModule }