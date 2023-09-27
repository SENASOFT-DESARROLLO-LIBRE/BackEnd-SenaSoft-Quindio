const mongoose = require('mongoose');

// Definir el esquema para las ubicaciones
const locationSchema = new mongoose.Schema({
  nombre: String,
  posX: Number,
  posY: Number,
});

// Definir el esquema para las conexiones
const connectionSchema = new mongoose.Schema({
  ubicacion1: String,
  ubicacion2: String,
  peso: Number,
});

// Definir el esquema para el objeto principal
const mainSchema = new mongoose.Schema({
  ubicaciones: [locationSchema],
  conexiones: [connectionSchema],
  inicio: String,
});

// Crear el modelo para el objeto principal
const MainModel = mongoose.model('Main', mainSchema);

module.exports = MainModel;