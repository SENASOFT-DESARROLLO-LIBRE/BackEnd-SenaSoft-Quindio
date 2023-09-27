const mongoose = require('mongoose');

// Define el esquema de ubicación
const locationSchema = new mongoose.Schema({
  nombre: String,
  posX: Number,
  posY: Number,
  conexiones: [
    {
      ubicacion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
      },
      peso: Number,
    },
  ],
});

module.exports = mongoose.model('Location', locationSchema);