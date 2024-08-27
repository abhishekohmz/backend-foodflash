const jwt = require('jsonwebtoken')

const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token')
    if (!token) {
        res.status(401).send({
            errors: "Please authenticate using valid token"
        })
    } else {
        try {
            const data = jwt.verify(token, 'secret_key')
            req.user = data.user
            next()
        } catch (error) {
            res.status(401).send({
                errors: "please authenticate using valid token"
            })
        }
    }
}

module.exports = fetchUser