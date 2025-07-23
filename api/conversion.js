export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método no permitido' });
    return;
  }

  // DATOS DE META
  const ACCESS_TOKEN = 'EAAR9drni3r4BPKnapJLYL9jTyYI4Ef8gPG56R2hlXAy7leMD79jYzYK94uFbwI4WZBBn3OAmBNHU7dePZBVFXBkOqgAUshCY9X4peXFdZAlrLSArXGuw4p4vzZAz9vLKweZAPDkuQNMRk6omxYM8ZAl0ZAjH1C1TEHCxiQ48evXdrZBQZBNDiKIgYOnUDzYdRK4CUJgZDZD';
  const PIXEL_ID = '587660557560617';

  const { event_name, user_data } = req.body || {};

  // Agrega la IP real si la tenés (Vercel la manda por header especial)
  const client_ip_address =
    req.headers['x-forwarded-for']?.split(',').shift() ||
    req.connection?.remoteAddress ||
    '';

  const event = {
    event_name: event_name || 'ClickWhatsAap',
    event_time: Math.floor(Date.now() / 1000),
    action_source: 'website',
    user_data: {
      ...user_data,
      client_ip_address,
    },
  };

  const payload = { data: [event] };

  // Hacer el POST a Facebook
  try {
    const fbRes = await fetch(
      `https://graph.facebook.com/v18.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );
    const fbData = await fbRes.json();
    res.status(200).json(fbData);
  } catch (err) {
    res.status(500).json({ error: 'Error enviando a Meta', detail: err.message });
  }
}
