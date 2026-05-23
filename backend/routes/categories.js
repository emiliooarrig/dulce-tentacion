const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken } = require('../middleware/auth');

// GET /api/categories — público
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM categories ORDER BY nombre ASC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// POST /api/categories
router.post('/', verifyToken, async (req, res) => {
  const { nombre, descripcion } = req.body;
  if (!nombre) return res.status(400).json({ message: 'El nombre es requerido' });
  try {
    const [result] = await db.query(
      'INSERT INTO categories (nombre, descripcion) VALUES (?, ?)',
      [nombre, descripcion || null]
    );
    res.status(201).json({ id: result.insertId, message: 'Categoría creada' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// PUT /api/categories/:id
router.put('/:id', verifyToken, async (req, res) => {
  const { nombre, descripcion } = req.body;
  if (!nombre) return res.status(400).json({ message: 'El nombre es requerido' });
  try {
    const [result] = await db.query(
      'UPDATE categories SET nombre=?, descripcion=? WHERE id=?',
      [nombre, descripcion || null, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Categoría no encontrada' });
    res.json({ message: 'Categoría actualizada' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// DELETE /api/categories/:id
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM categories WHERE id=?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Categoría no encontrada' });
    res.json({ message: 'Categoría eliminada' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

module.exports = router;
