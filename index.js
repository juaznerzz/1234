const express = require('express');
const cors = require('cors');
const app = express();

// Configurar CORS para permitir solicitudes de tu extensión de Chrome
const corsOptions = {
  origin: "chrome-extension://mdkomdcjoolkagjnlaaplbnoamaafe", // Esta es la URL de tu extensión de Chrome
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
  credentials: true // Esto es importante si necesitas compartir cookies o cabeceras de autenticación
};

app.use(cors(corsOptions));  // Aplicar CORS con las opciones configuradas
app.use(express.json());  // Para manejar datos JSON en las solicitudes

// Ruta para la validación de la licencia
app.post('/skip-validation', (req, res) => {
    const { key } = req.body;

    if (key === "fake123") {
        // Si la clave es válida, responde con éxito y activa las funciones premium
        res.json({
            success: true,
            message: "Licencia válida con la clave 'fake123'. Todas las funciones premium están activadas.",
            key: "fake123",
            premiumFeatures: {
                feature1: true,
                feature2: true,
                feature3: true
            }
        });
    } else {
        // Si la clave es inválida, responde con error
        res.status(400).json({
            success: false,
            message: "Clave de licencia inválida."
        });
    }
});

// Configuración para el puerto en Render (usando la variable de entorno PORT)
const PORT = process.env.PORT || 3000; // Si no se encuentra la variable de entorno, usa el puerto 3000
app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});

app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
