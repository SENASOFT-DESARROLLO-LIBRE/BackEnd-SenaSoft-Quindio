const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add a email'],
        unique: true
    },
    cellphone: {
        type: String,
        required: [true, 'Please add a cellphone'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please add a password']
    },
    status: {
        type: String,
        required: true,
        default: "UNVERIFIED"
    },
},
{
    timestamps: true,
    versionKey: false,
})

module.exports = mongoose.model('User', userSchema);