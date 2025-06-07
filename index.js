const express = require('express');
const cors = require('cors');
const app = express();

// Configurar CORS para permitir solicitudes de tu extensión de Chrome
const corsOptions = {
  origin: "chrome-extension://mdkomdcjoolkagjnlaaplbnoamaafe", // Esta es la URL de tu extensión de Chrome
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
};

app.use(cors(corsOptions));  // Aplicar CORS con las opciones configuradas
app.use(express.json());

// Ruta para la validación de la licencia
app.post('/skip-validation', (req, res) => {
    const { key } = req.body;

    if (key === "fake123") {
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
        res.status(400).json({
            success: false,
            message: "Clave de licencia inválida."
        });
    }
});

// Usar el puerto asignado por Render, o 3000 como valor por defecto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
