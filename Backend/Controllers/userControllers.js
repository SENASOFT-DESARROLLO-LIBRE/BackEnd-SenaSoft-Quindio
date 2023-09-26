const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../Model/userModel');
const { v4: uuidv4 } = require('uuid');
const sendEmail = require('../Config/email');
// const nodemailer = require('nodemailer')
// const crypto = require('crypto');
// const moment = require('moment');

const registerUser = asyncHandler(async(req, res) => {
    const { name, email, cellphone, password } = req.body

    if (!name || !email || !cellphone || !password) {
        res.status(400)
        throw new Error('Please add all fields')
    }

    // Check if user exists
    let userExists = await User.findOne({ email })

    if (userExists) {
        res.status(400)
        throw new Error('User already exists')
    }

    const code = uuidv4();
    

    userExists = new User({ name, email, cellphone, code})

    await sendEmail(email, 'ACTIVACION DE CUENTA!', `Hola, tu cuenta ha sido activada para poder utilizarla en el aplicativo \n`); 

    // Hash Password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create User
    const user = await User.create({
        name,
        email,
        cellphone,
        password: hashedPassword,
    })

    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            cellphone: user.cellphone,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }

    const savedUser = await user.save()

    // console.log(savedUser);
});

const login = asyncHandler(async(req, res) => {
    const { email, password } = req.body

    // Check for user email
    const user = await User.findOne({email});

    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            phone: user.cellphone,
            token: generateToken(user._id),
            msg: "User Registrado"
        })
}
     else {
        res.status(400)
        throw new Error('Invalid credentials')
    }
    console.log(user);
});

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '90d', 
    })
}

module.exports = {
    registerUser,
    login,
}
