const express = require("express");
const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Ruta para la validación de la licencia
app.post("/skip-validation", (req, res) => {
  const { sub_key } = req.body; // La clave de licencia enviada desde el cliente
  
  // Verificar si la clave es 'fake123'
  if (sub_key === "fake123") {
    return res.json({
      success: true,
      message: "Licencia válida con la clave 'fake123'. Todas las funciones premium están activadas.",
      key: "fake123", // Simulando que la clave es válida
      premiumFeatures: {
        feature1: true,
        feature2: true,
        feature3: true,
        // Aquí podrías listar más características premium activadas
      }
    });
  } else {
    return res.json({
      success: false,
      message: "Clave de licencia inválida.",
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
