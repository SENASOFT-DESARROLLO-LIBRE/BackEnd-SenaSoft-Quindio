const nodemailer = require('nodemailer');

const mail = {
    user: 'morenoriosjhonalexander@gmail.com',
    pass: '1091884556'
}

const transporter = nodemailer.createTransport({
    // Debes especificar el servicio de correo que estás utilizando como 'Gmail'
    service: 'Gmail',
    auth: {
        user: mail.user,
        pass: 'jrfr rdch rose iwac',
    },
});

const sendEmail = async (email, subject, text) => {
    try {
        await transporter.sendMail({
            from: mail.user, // sender address
                to: email,
                subject, // Subject line
                text,
        });
        console.log("Correo enviado correctamente");
    } catch (error) {
        console.log(error);
    }
};

module.exports = sendEmail;
