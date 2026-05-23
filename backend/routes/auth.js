const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { JWT_SECRET } = require('../middleware/auth');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Email y contraseña requeridos' });

  try {
    const [rows] = await db.query(
      'SELECT * FROM users WHERE email = ? AND activo = TRUE',
      [email]
    );
    if (rows.length === 0)
      return res.status(401).json({ message: 'Credenciales inválidas' });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ message: 'Credenciales inválidas' });

    const token = jwt.sign(
      { id: user.id, email: user.email, nombre: user.nombre, rol: user.rol },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      user: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

module.exports = router;
