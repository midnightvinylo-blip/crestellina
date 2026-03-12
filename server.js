/**
 * server.js - Backend nativo para Lunares (Servidor de Archivos y Configuración)
 */
require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, '.')));

// Puente para que el frontend obtenga las claves necesarias de .env
app.get('/api/config', (req, res) => {
    res.json({
        VAPI_PUBLIC_KEY: process.env.VAPI_PUBLIC_KEY,
        VAPI_ASSISTANT_ID: process.env.VAPI_ASSISTANT_ID
    });
});

app.listen(port, () => {
    console.log(`\x1b[32m[Lunares]\x1b[0m Servidor local en http://localhost:${port}`);
});
