const express = require('express');
const app = express();
const cors = require('cors');

// Middleware para manejar las solicitudes JSON
app.use(express.json());
app.use(cors());

// Simulando una base de datos de licencias
const validLicenses = {
  'fake123': { premiumFeatures: { feature1: true, feature2: false, feature3: true } },
  'anotherLicenseKey': { premiumFeatures: { feature1: false, feature2: true, feature3: false } }
};

// Ruta para validar la clave de licencia
app.post('/validate', (req, res) => {
  const { sub_key, unique_id, slug, mo_no, b_version, r_id } = req.body;

  // Verificar si la clave de licencia es válida
  if (validLicenses[sub_key]) {
    const licenseData = validLicenses[sub_key];
    
    // Responder con la información de la licencia válida
    return res.json({
      success: true,
      message: 'Licencia válida',
      premiumFeatures: licenseData.premiumFeatures,
    });
  }

  // Si la clave de licencia no es válida
  return res.status(400).json({
    success: false,
    message: 'Licencia inválida',
  });
});

// Iniciar el servidor en el puerto 3000 (puedes cambiar el puerto si lo necesitas)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
