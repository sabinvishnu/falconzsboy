// Vercel Serverless Function: Global Visitor Shots Storage & Real-Time Sync
// Powered by Upstash Redis on Vercel

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '8mb'
    }
  }
};

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Upstash / Vercel KV Environment Variables
  const kvUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const kvToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

  // Execute Upstash Redis Command via POST REST API (handles large payloads safely)
  async function redisExec(commandArgs) {
    if (!kvUrl || !kvToken) return null;
    const cleanUrl = kvUrl.replace(/\/$/, '');
    try {
      const response = await fetch(cleanUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${kvToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(commandArgs)
      });
      const data = await response.json();
      return data.result;
    } catch (err) {
      console.error('Upstash Redis error:', err);
      return null;
    }
  }

  const STORAGE_KEY = 'falconz_visitor_shots_global';

  // GET: Fetch all visitor shots
  if (req.method === 'GET') {
    try {
      if (kvUrl && kvToken) {
        const raw = await redisExec(['GET', STORAGE_KEY]);
        let shots = [];
        if (raw) {
          try {
            shots = typeof raw === 'string' ? JSON.parse(raw) : raw;
          } catch (e) {
            shots = [];
          }
        }
        return res.status(200).json({
          success: true,
          source: 'upstash_redis',
          shots: Array.isArray(shots) ? shots : []
        });
      }

      return res.status(200).json({
        success: true,
        source: 'local_mode',
        shots: []
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message, shots: [] });
    }
  }

  // POST: Publish new shot, Like, or Delete
  if (req.method === 'POST') {
    try {
      let body = req.body || {};
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch (e) {}
      }

      const action = body.action || 'publish';

      if (kvUrl && kvToken) {
        const raw = await redisExec(['GET', STORAGE_KEY]);
        let shots = [];
        if (raw) {
          try {
            shots = typeof raw === 'string' ? JSON.parse(raw) : raw;
          } catch (e) {
            shots = [];
          }
        }
        if (!Array.isArray(shots)) shots = [];

        if (action === 'publish') {
          const newShot = body.shot;
          if (!newShot || !newShot.imgData || !newShot.name) {
            return res.status(400).json({ success: false, error: 'Invalid shot payload.' });
          }

          // Insert latest photo at start, keep latest 80 photos
          shots.unshift(newShot);
          if (shots.length > 80) shots = shots.slice(0, 80);

          await redisExec(['SET', STORAGE_KEY, JSON.stringify(shots)]);
          return res.status(200).json({ success: true, shot: newShot, total: shots.length });
        }

        if (action === 'like') {
          const { id, delta } = body;
          const target = shots.find(s => s.id === id);
          if (target) {
            target.likes = Math.max(0, (target.likes || 0) + (delta || 1));
            await redisExec(['SET', STORAGE_KEY, JSON.stringify(shots)]);
          }
          return res.status(200).json({ success: true, id, likes: target ? target.likes : 0 });
        }

        if (action === 'delete') {
          const { id } = body;
          shots = shots.filter(s => s.id !== id);
          await redisExec(['SET', STORAGE_KEY, JSON.stringify(shots)]);
          return res.status(200).json({ success: true, id });
        }
      }

      return res.status(200).json({
        success: true,
        source: 'client_synced',
        shot: body.shot || null
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
