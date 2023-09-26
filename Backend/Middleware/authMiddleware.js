const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../Model/userModel');

const protect = asyncHandler(async (req, res, next) => {
    let token

    // Verificación del encabezado de autorización
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Obtener el token del header
            token = req.headers.authorization.split(' ')[1]

            // Verificar token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            // Obtener el usuario por el token
            req.user = await User.findById(decoded.id).select('-password')

            next()
        } catch (error) {
            console.log(error);
            res.status(401)
            throw new Error('Not authorized')
        }
    }

    if (!token) {
        res.status(401)
        throw new Error('Not authorized, no Token')
    }
})


module.exports = { protect };
