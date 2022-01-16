
const base = (status, message, code) => { return { status, message, code } }

const HTTP = {
    ok: (message) => { return base(true, message, 200)},
    created: (message) => { return base( true, message, 201 ) },
    badRequest: (message) => { return base(false, message, 400) },
    internalServer: (message = 'Server error, please try again later ;)') => { return base(false, message, 500)},
    notFound: (message = 'The resource does not exists') => { return base(false, message, 404) },
    conflict: (message) => { return base(false, message, 409) },
    unauthorized: (message) => { return base(false, message, 401) },
    forbidden: (message) => { return base(false, message, 403) }
}

module.exports = HTTP;