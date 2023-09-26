const nodemailer = require('nodemailer');

const mail = {
    user: 'morenoriosjhonalexander@gmail.com',
    pass: '1091884556'
}

const transporter = nodemailer.createTransport({
    host: "morenoriosjhonalexander@gmail.com",
    port: 5000,
    tls: {
        rejectUnauthorized: false,
    },
    secure: false,
    auth: {
      user: mail.user,
      pass: mail.pass,
    },
  });

const sendEmail = async (email, subject, html) => {
    try {
            await transporter.sendMail({
            from: `Fred Foo 👻 ${mail.user}`, // sender address
            to: email, // list of receivers
            subject,
            text: "Hola zozozorras", // plain text body
            html,
    })} catch (error) {
        console.log(error);
    }
};

module.exports = sendEmail