const nodemailer = require('nodemailer');

const mail = {
    user: 'morenoriosjhonalexander@gmail.com',
    pass: '1091884556'
}

// Metodo para enviar en correo
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: mail.user,
        pass: 'jrfr rdch rose iwac',
    },
});

// Envio del correo
  const sendEmail = async (email, subject, html) => {
    try {
        
        await transporter.sendMail({
            from: mail.user, // sender address
            to: email, // list of receivers
            subject, // Subject line
            text: "Hola", // plain text body
            html, // html body
        });

    } catch (error) {
        console.log('Algo no va bien con el email', error);
    }
  }

  // Metodo para obtener el template
  const getTemplate = (name, token) => {
      return `
        <head>
            <link rel="stylesheet" href="./style.css">
        </head>
        
        <div id="email___content">
            <h2>Hola ${ name }</h2>
            <p>Para confirmar tu cuenta, ingresa al siguiente enlace</p>
            <a
                href="http://localhost:5000/api/users/confirm/${ token }"
                target="_blank"
            >Confirmar Cuenta</a>
        </div>
      `;
  }

  module.exports = {
    sendEmail,
    getTemplate
  }