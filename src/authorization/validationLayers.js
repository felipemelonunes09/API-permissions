const validationLayers = () => {

    const validateRoute = async (url, method, dataSource) => { 
        const route = (await dataSource.findByOrigin(url, method)).result
        return (route == undefined || route.origin == undefined) ? undefined : route
    }

    const validateUserToken = async (token, decoder, dataSource, secret)  => {

        const authToken = token.split(' ')[1]
        const decode = decoder.decode(authToken, secret)
        
        if (decode == undefined)
            return undefined

        if (decode.email == undefined || decode.id == undefined) 
            return undefined

        let user = (await dataSource.findOne(decode.id, { exclude: ['password'] } ,{ email: decode.email })).result

        if (user.id == undefined || user == undefined)
            return undefined

        return { authenticated: true, token: authToken, payload: user }
    }

    return { validateRoute, validateUserToken }
}

module.exports = validationLayers