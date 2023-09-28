const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../Model/userModel');
const MainModel = require('../Model/MainModel');
const { v4: uuidv4 } = require('uuid');
const { sendEmail, getTemplate } = require('../Config/email');
const { getToken, getTokenData } = require('../Config/jwtConfig');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const generateRandom = () => {
    const password = crypto.randomBytes(4).toString('hex');
    return password;
};

const registerUser = asyncHandler(async (req, res) => {
    // Obtener la data del usuario
    const { name, emailCreate, passwordCreate } = req.body;

    if (!name || !emailCreate || !passwordCreate) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    // Validar si el usuario existe
    let userExists = await User.findOne({ emailCreate });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // Generar el codigo
    const code = uuidv4();
    console.log(code);

    // Crear un nuevo usuario
    const user = new User({ name, emailCreate, code });

    // Generar Token
    const token = getToken({emailCreate, code});

    // Obtener un template
    const template = getTemplate(name, token);

    // Envia el Email
    await sendEmail(emailCreate,'ACTIVACIÓN DE CUENTA!', template);
    
    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(passwordCreate, salt);

    // Encripta la contraseña
    user.passwordCreate = hashedPassword;

    // Responde con un mensaje 
    res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.emailCreate,
        token: getToken(user._id),
    });

    // Guardar el usuario en la base de datos
    const savedUser = await user.save();
    // console.log(savedUser);
});

const confirm = asyncHandler(async (req, res) => {
    try {
       // Obtener el token
       const { token } = req.params;
       
       // Verificar la data
       const data = await getTokenData(token);

       if(!data) {
            return res.json({
                success: false,
                msg: 'Error al obtener data'
            });
       }

       console.log(data);

       const { emailCreate } = data.data;

       // Verificar existencia del usuario
       let user = await User.findOne({ emailCreate });

       if(!user) {
            return res.json({
                success: false,
                msg: 'Usuario no existe'
            });
       }

       // Actualizar usuario
       user.status = true;
       await user.save();

       // Redireccionar a la confirmación
       return res.redirect('http://localhost:3000/ConfirmAccount');
        
    } catch (error) {
        console.log(error);
        return res.json({
            success: false,
            msg: 'Error al confirmar usuario'
        });
    }
});

const login = asyncHandler(async(req, res) => {
    const { emailCreate, passwordCreate } = req.body

    // Validar email
    const user = await User.findOne({emailCreate});

    if (!user) {
        res.status(400).json({ msg: 'Usuario no encontrado' });
        return;
    }

    // Validar la verificación de login
    if (user.status === true) {
        if (user && (await bcrypt.compare(passwordCreate, user.passwordCreate))) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.emailCreate,
                token: getToken(user._id),
                msg: "LOGUEADO"
            })
        } else {
            res.status(400)
            throw new Error('Invalid credentials')
        }
    } else {
        res.json({
            msg: `DENEGADO, SEÑOR@ ${user.name}, VERIFIQUE SU CORREO PARA ACTIVAR SU CUENTA`
        })
    }
}
);

const recoverPassword = asyncHandler(async(req, res) => {
    const { email } = req.body

    const mail = {
        user: 'morenoriosjhonalexander@gmail.com',
        pass: '1091884556'
    }

    if(!email) res.status(400).send({msg: "Debe ingresar el email"});

    const user = await User.findOne({email});

        let newPassword = generateRandom();
            if(user){
                let config = {
                    host: "smtp.gmail.com",
                    port: 587,
                    auth: {
                        user: mail.user, // generated ethereal user
                        pass: "jrfr rdch rose iwac", // generated ethereal password
                    },
                }
                let mensaje = {
                from: mail.user, // sender address
                to: user.email,
                // list of receivers
                subject: "Recuperacion de contraseña", // Subject line
                text: `¿Hola, has olvidado tu contraseña? \n Para ingresar a tu cuenta de nuevo deberas usar esta contraseña: 
                Tu nueva contraseña es: ${newPassword} \n\n Cuado ingreses no olvides cambiar tu contraseña`
            }
            
            const transport = nodemailer.createTransport(config)
            const info = transport.sendMail(mensaje)
            //   console.log(info)
            
            if(newPassword){
                const salt = bcrypt.genSaltSync(10)
                const hashPassword = bcrypt.hashSync(newPassword, salt)
                newPassword = hashPassword
            }
            // console.log(newPassword);

                User.updateOne({email}, { $set: { password: newPassword } }).then(()=>{
                    res.json({
                        msg: "Se cambio la contraseña User"
                    })
                })
        } else {
            res.status(400)
            throw new Error('Invalid email')
        }
});

const saveLocations = asyncHandler(async(req, res) => {
    try {
        const { ubicaciones , conexiones , inicio} = req.body
        // Crear un nuevo objeto con los datos proporcionados
        const newObject = new MainModel({
            ubicaciones,
            conexiones,
            inicio,
          })
    
        // Guardar el objeto en la base de datos
        await newObject.save();
    
        console.log('Objeto guardado exitosamente');
        res.status(200).json({ message: 'Objeto guardado exitosamente' });
      } catch (error) {
        console.error('Error al guardar el objeto:', error);
        res.status(500).json({ error: 'Error al guardar el objeto' });
      }
});

module.exports = {
    registerUser,
    login,
    confirm,
    recoverPassword,
    saveLocations,
}
