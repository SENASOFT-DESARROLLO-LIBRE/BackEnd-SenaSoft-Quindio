const jwt = require('jsonwebtoken');

// Crear el token
const getToken = (payload) => {
    return jwt.sign({
        data: payload
    }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

// Obtener el token
const getTokenData = (token) => {
    let data = null;
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if(err) {
            console.log('Error al obtener data del token');
        } else {
            data = decoded;
        }
    });

    return data;
}

module.exports = {
    getToken,
    getTokenData
}