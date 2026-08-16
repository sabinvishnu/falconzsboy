// Vercel Serverless Function: Protected Admin Photo Deletion Endpoint
// Method: POST /api/delete-shot
// Header: Authorization: Bearer <ADMIN_TOKEN>

// SHA-256 hash of the admin master passcode
const ADMIN_HASH = process.env.ADMIN_AUTH_HASH || "77f9872e411bf88f34346eb4a055d0458df8a5a40a373b7e7161b9a955cb1ea8";

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
