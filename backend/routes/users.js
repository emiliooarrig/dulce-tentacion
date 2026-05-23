const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const { verifyToken } = require('../middleware/auth');

// GET /api/users
router.get('/', verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, nombre, email, rol, activo, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// POST /api/users
router.post('/', verifyToken, async (req, res) => {
  const { nombre, email, password, rol } = req.body;
  if (!nombre || !email || !password)
    return res.status(400).json({ message: 'Nombre, email y contraseña son requeridos' });
  try {
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0)
      return res.status(409).json({ message: 'El email ya está registrado' });

    const hashed = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO users (nombre, email, password, rol) VALUES (?, ?, ?, ?)',
      [nombre, email, hashed, rol || 'admin']
    );
    res.status(201).json({ id: result.insertId, message: 'Usuario creado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// PUT /api/users/:id
router.put('/:id', verifyToken, async (req, res) => {
  const { nombre, email, password, rol, activo } = req.body;
  try {
    const [existing] = await db.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
    if (existing.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });

    const user = existing[0];
    const hashed = password ? await bcrypt.hash(password, 10) : user.password;

    await db.query(
      'UPDATE users SET nombre=?, email=?, password=?, rol=?, activo=? WHERE id=?',
      [
        nombre || user.nombre,
        email || user.email,
        hashed,
        rol || user.rol,
        activo !== undefined ? activo : user.activo,
        req.params.id,
      ]
    );
    res.json({ message: 'Usuario actualizado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// DELETE /api/users/:id
router.delete('/:id', verifyToken, async (req, res) => {
  if (req.user.id === parseInt(req.params.id))
    return res.status(400).json({ message: 'No puedes eliminar tu propio usuario' });
  try {
    const [result] = await db.query('DELETE FROM users WHERE id=?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json({ message: 'Usuario eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

module.exports = router;
