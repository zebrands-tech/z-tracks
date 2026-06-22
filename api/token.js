export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const ZECORE = 'https://zecore.zebrands.mx';
  const action = req.body.action;

  try {
    if (action === 'token') {
      const { code, code_verifier, redirect_uri } = req.body;
      const params = new URLSearchParams({
        grant_type: 'authorization_code',
        code, redirect_uri,
        client_id: '3b2fb99532',
        client_secret: 'f18a4bcf8c',
        code_verifier
      });
      const r = await fetch(ZECORE + '/api/method/frappe.integrations.oauth2.get_token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json' },
        body: params.toString()
      });
      return res.status(200).json(await r.json());
    }

    if (action === 'profile') {
      const { access_token } = req.body;
      const r = await fetch(ZECORE + '/api/method/frappe.integrations.oauth2.openid_profile', {
        headers: { 'Authorization': 'Bearer ' + access_token, 'Accept': 'application/json' }
      });
      return res.status(200).json(await r.json());
    }

    return res.status(400).json({ error: 'Unknown action' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
