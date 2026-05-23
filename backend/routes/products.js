const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../config/db');
const { verifyToken } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    cb(ext && mime ? null : new Error('Solo se permiten imágenes'), ext && mime);
  },
});

// GET /api/products — lista pública
router.get('/', async (req, res) => {
  try {
    const { categoria_id } = req.query;
    let query = `
      SELECT p.*, c.nombre AS categoria_nombre
      FROM products p
      LEFT JOIN categories c ON p.categoria_id = c.id
      WHERE p.activo = TRUE
    `;
    const params = [];
    if (categoria_id) {
      query += ' AND p.categoria_id = ?';
      params.push(categoria_id);
    }
    query += ' ORDER BY p.created_at DESC';
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// GET /api/products/featured
router.get('/featured', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT p.*, c.nombre AS categoria_nombre
       FROM products p
       LEFT JOIN categories c ON p.categoria_id = c.id
       WHERE p.destacado = TRUE AND p.activo = TRUE
       ORDER BY p.created_at DESC LIMIT 4`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// GET /api/products/all — lista completa para admin
router.get('/all', verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT p.*, c.nombre AS categoria_nombre
       FROM products p
       LEFT JOIN categories c ON p.categoria_id = c.id
       ORDER BY p.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT p.*, c.nombre AS categoria_nombre
       FROM products p LEFT JOIN categories c ON p.categoria_id = c.id
       WHERE p.id = ?`,
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// POST /api/products
router.post('/', verifyToken, upload.single('imagen'), async (req, res) => {
  const { nombre, descripcion, precio, categoria_id, destacado } = req.body;
  if (!nombre || !precio)
    return res.status(400).json({ message: 'Nombre y precio son requeridos' });
  const imagen = req.file ? `/uploads/${req.file.filename}` : null;
  try {
    const [result] = await db.query(
      'INSERT INTO products (nombre, descripcion, precio, imagen, categoria_id, destacado) VALUES (?, ?, ?, ?, ?, ?)',
      [nombre, descripcion || null, precio, imagen, categoria_id || null, destacado === 'true' ? 1 : 0]
    );
    res.status(201).json({ id: result.insertId, message: 'Producto creado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// PUT /api/products/:id
router.put('/:id', verifyToken, upload.single('imagen'), async (req, res) => {
  const { nombre, descripcion, precio, categoria_id, destacado, activo } = req.body;
  try {
    const [existing] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (existing.length === 0) return res.status(404).json({ message: 'Producto no encontrado' });

    const imagen = req.file ? `/uploads/${req.file.filename}` : existing[0].imagen;
    await db.query(
      'UPDATE products SET nombre=?, descripcion=?, precio=?, imagen=?, categoria_id=?, destacado=?, activo=? WHERE id=?',
      [
        nombre || existing[0].nombre,
        descripcion !== undefined ? descripcion : existing[0].descripcion,
        precio || existing[0].precio,
        imagen,
        categoria_id !== undefined ? (categoria_id || null) : existing[0].categoria_id,
        destacado !== undefined ? (destacado === 'true' ? 1 : 0) : existing[0].destacado,
        activo !== undefined ? (activo === 'true' ? 1 : 0) : existing[0].activo,
        req.params.id,
      ]
    );
    res.json({ message: 'Producto actualizado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// DELETE /api/products/:id
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json({ message: 'Producto eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

module.exports = router;
