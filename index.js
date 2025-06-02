const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(cors());
app.use(express.json());

// Supabase
const SUPABASE_URL = 'https://rscbunzafavbqopxvwpq.supabase.co';
const SUPABASE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzY2J1bnphZmF2YnJvcHh2d3BxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0MjA4MjYsImV4cCI6MjA2Mjk5NjgyNn0.zgiSaPIWP8JL_013-Zl8H_0mR_7uBSH3JmCOakFXm4o';
const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);

app.post('/validate', async (req, res) => {
  const { sub_key } = req.body;
  if (!sub_key) return res.status(400).json({ valid: false, message: 'Falta clave de licencia' });

  const { data, error } = await supabase
    .from('licencias_test')
    .select('*')
    .eq('sub_key', sub_key)
    .single();

  if (error || !data) {
    return res.status(401).json({ valid: false, message: 'Licencia inválida' });
  }

  return res.json({ valid: true, license: data });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en puerto ${PORT}`);
});
