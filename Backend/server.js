const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv').config();
const connectDB = require('../Backend/Config/db')
const port = process.env.PORT || 5000;
const cors = require('cors');
const protect = require('../Backend/Middleware/authMiddleware');
const { errorHandler } = require('../Backend/Middleware/errorMiddleware')

const app = express();
// Conexión de la base de datos
connectDB();

// Permitir conexion Frontend y Backend
const corsOptions = {
    origin: '*'
};

app.use(cors(corsOptions));


app.use(express.json());
app.use(express.urlencoded({extended: false}));
  

app.use('/api/users', require('./Routes/userRoutes'));
app.use(errorHandler)

// Verificar que el servidor este escuchando
app.listen(port, () => console.log(`Server started on port ${port}`));