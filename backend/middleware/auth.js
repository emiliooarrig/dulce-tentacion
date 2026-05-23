const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dulce_tentacion_secret_key';

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'Token requerido' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token requerido' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ message: 'Token inválido o expirado' });
  }
}

module.exports = { verifyToken, JWT_SECRET };
