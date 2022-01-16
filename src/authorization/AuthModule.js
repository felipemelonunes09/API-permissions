const jwt = require("jsonwebtoken")
const { JWT_SECRET } = require("../enviroment")
const { internalServer } = require("../utils/statusHTTP")
const HTTP = require("../utils/statusHTTP")
const { AUTHORIZATION_DICIONATY, ROUTE_DICTIONARY } = require("./utils")
const validationLayers = require("./validationLayers")

const AuthModule = () => {

    let managerModel = { route: undefined, user: undefined, permission: undefined }

    const shield = () => {

        let contexRoute = undefined
        let user = { }
        const authorization = { }
        const layers = validationLayers()

        const verifyRoute = async ({ url, method }) => {
            const route = await layers.validateRoute(url, method, managerModel.route)

            if (route == undefined)
                return ROUTE_DICTIONARY.NOT_MAPPED
            
            contexRoute = route
            return (route.private == true) ? ROUTE_DICTIONARY.PRIVATE : ROUTE_DICTIONARY.PUBLIC
        }

        const verifyUser = async ({ headers }) => {

            const authToken = headers['authorization']
            const result = await layers.validateUserToken(authToken, jwt, managerModel.user, JWT_SECRET)

            if (result == undefined)
                return false
            
            user = { token: result.token, payload: result.payload }
            return result.authenticated
        }
        
        const authorizeRoute = async (req, res, next) => {
            try {
                const result = (await verifyRoute(req)) || ROUTE_DICTIONARY.NOT_MAPPED
                switch (result) {
                    case ROUTE_DICTIONARY.PUBLIC:
                        authorization.route = AUTHORIZATION_DICIONATY.ACCEPTED
                        next()
                    break;
                    case ROUTE_DICTIONARY.NOT_MAPPED: 
                        authorization.route = AUTHORIZATION_DICIONATY.REJECT

                        const result = HTTP.notFound('Reject cause: not mapped route')
                        res.status(result.code).send(result)
                    break;

                    case ROUTE_DICTIONARY.PRIVATE: 
                        authorization.route = AUTHORIZATION_DICIONATY.OK
                        return;
                    break; 
                }
            }
            catch(e) {
                authorization.error = AUTHORIZATION_DICIONATY.ERROR
            }
        }

        const authorizeUser = async (req, res) => {
            try {                
                const isAuthenticated = (await verifyUser(req)) || false

                if (isAuthenticated === true) {
                    authorization.user = AUTHORIZATION_DICIONATY.OK
                    return ;
                }

                authorization.use = AUTHORIZATION_DICIONATY.REJECT
                const result = HTTP.unauthorized()
                res.status(result.code).send(result)
            } 
            catch (e) {
                authorization.error = AUTHORIZATION_DICIONATY.ERROR
            }
        }

        const authorizeAccess = async (req, res, next) => {
            try {
                const routePermissions = contexRoute.Permissions
                const userPermissions = user.payload.dataValues.mappedPermissions

                authorization.access = AUTHORIZATION_DICIONATY.REJECT;

                if (routePermissions.length > 0 && userPermissions.length > 0) {
                    routePermissions.forEach((routePermission) => {
                        const found = userPermissions.find(element => element.id == routePermission.id)
                        if (found != undefined) {
                            authorization.access = AUTHORIZATION_DICIONATY.OK 
                        }
                    })
                }

            }
            catch (e) {
                authorization.error = AUTHORIZATION_DICIONATY.ERROR
            }
        }

        const acceptOrReject = (res, next) => { 
            if (authorization.route == AUTHORIZATION_DICIONATY.OK &&
                authorization.user == AUTHORIZATION_DICIONATY.OK &&
                authorization.access == AUTHORIZATION_DICIONATY.OK 
            ) {
                next()
            }
            else {

                if (authorization.error == AUTHORIZATION_DICIONATY.ERROR) {
                    const result = HTTP.forbidden(`AuthModuleError: the route could not be authorized`)
                    res.status(result.code).send(result)
                } 
                else {
                    const result = HTTP.forbidden(`You must have the rights permissions to access this route`)
                    res.status(result.code).send(result)
                }
            }
        }

        const managerUserRouteAccess = async (req, res, next) => {
            try {
                await authorizeRoute(req, res, next)

                if (authorization.route == AUTHORIZATION_DICIONATY.OK)
                    await authorizeUser(req, res, next)
                    
                if (authorization.user == AUTHORIZATION_DICIONATY.OK)
                    await authorizeAccess(req, res, next)

                acceptOrReject(res, next)
            }
            catch (e) {
                const result = HTTP.internalServer('The manager user router access returned false')
                res.status(result.code).send(result)
            }
        }

        return managerUserRouteAccess 
    }

    const config = async (app, _manager, _router) => {
        managerModel = _manager
        app.use('/permissions', _router.permission)        
        app.use('/roles', _router.role)
        app.use('/routes', _router.route)
    }

    const configAndProtect = (app, _manager, _router) => {
        app.use(shield())
        config(app, _manager, _router)
    }

    return {
        config, configAndProtect,
        shield, validationLayers
    }
}

module.exports = { AuthModule }