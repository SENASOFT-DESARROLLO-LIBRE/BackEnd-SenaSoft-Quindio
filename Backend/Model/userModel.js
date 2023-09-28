const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    emailCreate: {
        type: String,
        required: [true, 'Please add a email'],
        unique: true
    },
    passwordCreate: {
        type: String,
        required: [true, 'Please add a password']
    },
    status: {
        type: Boolean,
        required: true,
        default: false
    },
},
{
    timestamps: true,
    versionKey: false,
})

module.exports = mongoose.model('User', userSchema);