const HTTP = require("../utils/statusHTTP")
const permissionRouter = require("./permissions/permissions.router")
const roleRouter = require("./roles/roles.router")
const routeRouter = require("./routes/routes.router")
const routesService = require("./routes/routes.service")

const AuthModule = () => {

    let managerModel = { route: undefined, role: undefined, permission: undefined }

    const shield = () => {

        let contexRoute = undefined
        const layers = validationLayers()

        const authorization = { }
        const user = { }

        const AUTHORIZATION_DICIONATY = {
            REJECT: -1,
            ACCEPTED: 0,
            OK : 1
        }

        const ROUTE_DICTIONARY = { 
            NOT_MAPPED: -1,
            PRIVATE: 0,
            PUBLIC: 1

        }

        const verifyRoute = async ({ url, method }) => {
            const route = await layers.validateRoute(url, method)
            if (route == undefined)
                return ROUTE_DICTIONARY.NOT_MAPPED
            
            contexRoute = route
            return (route.private == true) ? ROUTE_DICTIONARY.PRIVATE : ROUTE_DICTIONARY.PUBLIC
        }

        const verifyUser = async ({ headers }) => {

            const authToken = headers['authorization']
            const { authenticated, token, payload } = layers.validateUserToken(authToken)
            
            if (authenticated != true)
                return false
            
            user = { token, payload }
            return authenticated
        }

        const authorizeRoute = async (req, res, next) => {
            try {
                const result = await verifyRoute(req) || ROUTE_DICTIONARY.NOT_MAPPED
                console.log(result)
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
                const result = HTTP.internalServer()
                res.status(result.code).send(result)
            }
        }

        const authorizeUser = async (req, res) => {
            try {                
                const isAuthenticated = verifyUser(req) || false
                if ((await isAuthenticated) === true) {
                    authorization.user = true
                    return ;
                }

                const result = HTTP.unauthorized()
                res.status(result.code).send(result)
            } 
            catch (e) {
                const result = HTTP.internalServer()
                res.status(result.code).send(result)
            }
        }

        const managerUserRouteAccess = async (req, res, next) => {
            try {

                await authorizeRoute(req, res, next)
                    

                if (authorization.route == AUTHORIZATION_DICIONATY.OK)
                    await authorizeUser(req, res, next)
                    
                if (authorization.user == AUTHORIZATION_DICIONATY.OK)
                    await authorizeAccess(req, res, next)
            }
            catch (e) {
                const result = HTTP.internalServer()
                res.status(result.code).send(result)
            }
        }

        return managerUserRouteAccess 
    }

    const validationLayers = () => {

        const validateRoute = async (url, method) => { 
            const route = (await managerModel.route.findByOrigin(url, method)).result
            return (route == undefined || route.origin == undefined) ? undefined : route
        }

        const validateUserToken = async (token)  => {
            const authToken = token.split(' ')[1]
            console.log(authToken)
        }

        return { validateRoute, validateUserToken }
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