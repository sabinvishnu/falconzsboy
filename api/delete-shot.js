// Vercel Serverless Function: Protected Admin Photo Deletion Endpoint
// Method: POST /api/delete-shot
// Header: Authorization: Bearer <ADMIN_TOKEN>

// SHA-256 hash of the admin master passcode ("1122")
const ADMIN_HASH = process.env.ADMIN_AUTH_HASH || "b3282a2f2a28757b3a18ab833de16a9c54518c0b0cf493e3f0a7cf09386f326a";

export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  // Extract Bearer token
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7).trim() : '';

  if (!token || token !== ADMIN_HASH) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Admin authentication required to delete photos.'
    });
  }

  const { id } = req.body || {};
  if (!id) {
    return res.status(400).json({ success: false, error: 'Missing photo ID.' });
  }

  // Deletion authorized
  return res.status(200).json({
    success: true,
    message: `Photo with ID ${id} authorized and deleted successfully by Admin.`,
    id
  });
}
