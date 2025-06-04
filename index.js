const express = require("express");
const cors = require("cors");  // Importa CORS
const { createClient } = require("@supabase/supabase-js");
const app = express();

// Middleware para analizar solicitudes JSON
app.use(express.json());

// Configuración de CORS
app.use(cors());  // Esto permite solicitudes desde cualquier origen, puedes configurarlo para limitar los orígenes si es necesario

// Configuración de Supabase
const SUPABASE_URL = 'https://rscbunzafavbqopxvwpq.supabase.co';  // URL de tu proyecto Supabase
const SUPABASE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzY2J1bnphZmF2YnFvcHh2d3BxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0MjA4MjYsImV4cCI6MjA2Mjk5NjgyNn0.zgiSaPIWP8JL_013-Zl8H_0mR_7uBSH3JmCOakFXm4o'; // Reemplaza con tu clave API
const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);

// Endpoint para validar la licencia
app.post("/api/v1/validate", async (req, res) => {␊
  const { sub_key, mo_no } = req.body;  // Recibir los datos de la solicitud

  // Validar que los datos necesarios están presentes
  if (!sub_key || !mo_no) {
    return res.status(400).json({ valid: false, message: "Faltan datos (sub_key o mo_no)" });
  }

    try {
    // Log de los datos recibidos para depuración
    console.log("Datos recibidos para validación:", req.body);

    // Consultar en la base de datos de Supabase
    const { data, error } = await supabase
      .from("licencias")
      .select("*")
      .eq("sub_key", sub_key)
      .eq("mo_no", mo_no)
      .single();

    if (error || !data) {
      console.log("Error de validación o licencia no encontrada:", error);
      return res
        .status(401)
        .json({ valid: false, message: "Licencia o número de WhatsApp inválido" });
    }

    // Construye la respuesta en el formato esperado por la extensión
    return res.status(200).json({
      data: {
        validate: { sk_licence_key: data.sub_key },
        userDeviceData: {
          sub_key: data.sub_key,
          mo_no: data.mo_no,
          device_data: { skd_id: data.skd_id || data.id },
        },
      },
    });
  } catch (error) {
    console.error("Error en la validación:", error);
    return res.status(500).json({ valid: false, message: "Error en el servidor" });
  }
});

// Elimina la suscripción cuando el usuario desinstala la extensión
app.get("/api/v1/subscription-key/remove", async (req, res) => {
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ success: false, message: "Falta id" });
  }

  try {
    const { error } = await supabase
      .from("licencias")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error al eliminar la licencia:", error);
      return res.status(500).json({ success: false });
    }

    return res.json({ status: 200, removed: true });
  } catch (err) {
    console.error("Error en el servidor:", err);
    return res.status(500).json({ success: false });
  }
});

// Configuración del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en puerto ${PORT}`);
});
