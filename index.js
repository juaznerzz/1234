const express = require("express");
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(express.json());

// Supabase
const SUPABASE_URL = 'https://rscbunzafavbqopxvwpq.supabase.co'; // URL de tu proyecto Supabase
const SUPABASE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzY2J1bnphZmF2YnFvcHh2d3BxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0MjA4MjYsImV4cCI6MjA2Mjk5NjgyNn0.zgiSaPIWP8JL_013-Zl8H_0mR_7uBSH3JmCOakFXm4o'; // API Key de Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);

// Endpoint para validar la licencia
app.post("/api/v1/validate", async (req, res) => {
  const { sub_key, mo_no } = req.body;  // Clave de licencia y número de WhatsApp

  if (!sub_key || !mo_no) {
    return res.status(400).json({ valid: false, message: "Faltan datos (sub_key o mo_no)" });
  }

  try {
    // Validar licencia en Supabase
    const { data, error } = await supabase
      .from('licencias')  // Asegúrate de que la tabla en Supabase se llame 'licencias'
      .select('*')
      .eq('sub_key', sub_key)  // Validar por clave de licencia
      .eq('mo_no', mo_no)      // Validar por número de WhatsApp
      .single();               // Solo uno debe coincidir

    if (error || !data) {
      return res.status(401).json({ valid: false, message: "Licencia o número de WhatsApp inválido" });
    }

    // Respuesta exitosa con datos de licencia
    return res.json({
      valid: true,
      license: data,  // Devuelve la información de la licencia desde Supabase
    });
  } catch (error) {
    console.error("Error en validación:", error);
    return res.status(500).json({ valid: false, message: "Error en el servidor" });
  }
});

// Configuración del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en puerto ${PORT}`);
});
