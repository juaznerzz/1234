const express = require("express");
const cors = require("cors");
const { OAuth2Client } = require("google-auth-library");
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(cors());  // <-- Agregado para permitir CORS
app.use(express.json());

// OAuth2 Client ID
const CLIENT_ID = "134676342954-r4ihej9ssse8mae934qhv9kk08vajgrp.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);

// Supabase
const SUPABASE_URL = 'https://rscbunzafavbqopxvwpq.supabase.co';
const SUPABASE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzY2J1bnphZmF2YnJvcHh2d3BxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0MjA4MjYsImV4cCI6MjA2Mjk5NjgyNn0.zgiSaPIWP8JL_013-Zl8H_0mR_7uBSH3JmCOakFXm4o';
const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);

async function verifyToken(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID,
  });
  return ticket.getPayload();
}

app.post("/validate", async (req, res) => {
  console.log("Petición /validate recibida:", req.body);

  const { token, sub_key, unique_id, slug, mo_no, b_version, r_id } = req.body;

  if (!token) {
    console.log("Falta token");
    return res.status(400).json({ valid: false, message: "Token OAuth no proporcionado" });
  }

  if (!sub_key) {
    console.log("Falta sub_key");
    return res.status(400).json({ valid: false, message: "Falta la clave de licencia (sub_key)" });
  }

  try {
    console.log("Verificando token OAuth...");
    const payload = await verifyToken(token);
    console.log("Token válido para usuario:", payload.email);

    console.log("Buscando licencia en Supabase...");
    const { data, error } = await supabase
      .from('licencias_test')
      .select('*')
      .eq('sub_key', sub_key)
      .single();

    if (error || !data) {
      console.log("Licencia no válida o no encontrada:", error);
      return res.status(401).json({ valid: false, message: "Licencia inválida o no encontrada" });
    }

    console.log("Licencia válida encontrada:", data);

    return res.json({
      valid: true,
      user: {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      },
      license: data,
    });
  } catch (error) {
    console.error("Error en validación:", error);
    return res.status(401).json({ valid: false, message: "Token o licencia inválidos" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en puerto ${PORT}`);
});

