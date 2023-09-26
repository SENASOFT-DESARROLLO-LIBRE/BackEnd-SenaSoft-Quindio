const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../Model/userModel');
const { v4: uuidv4 } = require('uuid');
const { sendEmail, getTemplate } = require('../Config/email');
const { getToken, getTokenData } = require('../Config/jwtConfig');
// const nodemailer = require('nodemailer')
// const crypto = require('crypto');
// const moment = require('moment');

const registerUser = asyncHandler(async (req, res) => {
    // Obtener la data del usuario
    const { name, email, cellphone, password } = req.body;

    if (!name || !email || !cellphone || !password) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    // Validar si el usuario existe
    let userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // Generar el codigo
    const code = uuidv4();
    console.log(code);

    // Crear un nuevo usuario
    const user = new User({ name, email, cellphone, code });

    // Generar Token
    const token = getToken({email, code});

    // Obtener un template
    const template = getTemplate(name, token);

    // Envia el Email
    await sendEmail(email,'ACTIVACIÓN DE CUENTA!', template);
    
    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Set the hashed password
    user.password = hashedPassword;

    // Respond with a success message
    res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        cellphone: user.cellphone,
        token: getToken(user._id),
    });

    const savedUser = await user.save();
    // console.log(savedUser);
});

const confirm = asyncHandler(async (req, res) => {
    try {
       // Obtener el token
       const { token } = req.params;
       
       // Verificar la data
       const data = await getTokenData(token);

       if(data === null) {
            return res.json({
                success: false,
                msg: 'Error al obtener data'
            });
       }

       console.log(data);

       const { email } = data.data;

       // Verificar existencia del usuario
       const user = await User.findOne({ email }) || null;

       if(user === null) {
            return res.json({
                success: false,
                msg: 'Usuario no existe'
            });
       }

       // Actualizar usuario
       user.status = 'VERIFIED';
       await user.save();

       // Redireccionar a la confirmación
        res.json({
            success: true,
            msg: 'Usuario confirmado'
        });
        
    } catch (error) {
        console.log(error);
        return res.json({
            success: false,
            msg: 'Error al confirmar usuario'
        });
    }
});

const login = asyncHandler(async(req, res) => {
    const { email, password } = req.body

    // Check for user email
    const user = await User.findOne({email});

    if (user.status === 'VERIFIED') {
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                phone: user.cellphone,
                token: getToken(user._id),
                msg: "LOGUEADO"
            })
    }
    } else {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            // token: getToken(user._id),
            msg: "DENEGADO, ACTIVE SU CUENTA"
        })
    }
    console.log(user);
});

module.exports = {
    registerUser,
    login,
    confirm
}
