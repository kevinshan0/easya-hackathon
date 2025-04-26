const protocols = require('../../src/data/protocols');

export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json(protocols);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
} 