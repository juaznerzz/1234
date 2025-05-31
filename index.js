import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
app.use(cors());
app.use(express.json());

const SUPABASE_URL = 'https://rscbunzafavbqopxvwpq.supabase.co/rest/v1/licencias_test';
const SUPABASE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzY2J1bnphZmF2YnFvcHh2d3BxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0MjA4MjYsImV4cCI6MjA2Mjk5NjgyNn0.zgiSaPIWP8JL_013-Zl8H_0mR_7uBSH3JmCOakFXm4o';

app.post('/validate', async (req, res) => {
  const { user_id, sub_key } = req.body;

  if (!user_id || !sub_key) {
    return res.status(400).json({ valid: false, message: 'Faltan user_id o sub_key' });
  }

  try {
    const params = new URLSearchParams();
    params.append('user_id', `eq.${user_id}`);
    params.append('sub_key', `eq.${sub_key}`);
    params.append('valid', 'eq.true');

    const { data, status } = await axios.get(`${SUPABASE_URL}?${params.toString()}`, {
      headers: {
        apikey: SUPABASE_API_KEY,
        Authorization: `Bearer ${SUPABASE_API_KEY}`,
        Accept: 'application/json',
      },
    });

    if (status !== 200 || !data.length) {
      return res.json({ valid: false, message: 'Licencia no encontrada o inválida' });
    }

    const license = data[0];

    const now = new Date();
    const expiresAt = new Date(license.expires_at);

    if (expiresAt < now) {
      return res.json({ valid: false, message: 'Licencia expirada', expires_at: license.expires_at });
    }

    return res.json({
      valid: true,
      user_id: license.user_id,
      sub_key: license.sub_key,
      expires_at: license.expires_at,
      message: 'Licencia válida',
    });
  } catch (error) {
    console.error('Error validando licencia:', error.message);
    return res.status(500).json({ valid: false, message: 'Error interno de validación' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API corriendo en puerto ${PORT}`));

