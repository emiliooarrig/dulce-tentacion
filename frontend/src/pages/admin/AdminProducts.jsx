import { useEffect, useRef, useState } from 'react';
import api from '../../services/api';
import Swal from 'sweetalert2';

const emptyForm = {
  nombre: '', descripcion: '', precio: '', categoria_id: '', destacado: false, activo: true,
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);
  const [error, setError] = useState('');

  async function fetchData() {
    try {
      const [p, c] = await Promise.all([api.get('/products/all'), api.get('/categories')]);
      setProducts(p.data);
      setCategories(c.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchData(); }, []);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setImageFile(null);
    setError('');
    setShowModal(true);
  }

  function openEdit(p) {
    setEditing(p);
    setForm({
      nombre: p.nombre,
      descripcion: p.descripcion || '',
      precio: p.precio,
      categoria_id: p.categoria_id || '',
      destacado: !!p.destacado,
      activo: !!p.activo,
    });
    setImageFile(null);
    setError('');
    setShowModal(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      if (imageFile) data.append('imagen', imageFile);

      if (editing) {
        await api.put(`/products/${editing.id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/products', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      setShowModal(false);
      fetchData();
      Swal.fire({
        title: editing ? 'Producto actualizado' : 'Producto creado',
        text: editing ? 'Los cambios fueron guardados correctamente.' : 'El producto fue agregado correctamente.',
        icon: 'success',
        confirmButtonColor: '#FFAFCC',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    const result = await Swal.fire({
      title: '¿Eliminar producto?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#e05c7c',
      cancelButtonColor: '#CDB4DB',
    });
    if (!result.isConfirmed) return;
    try {
      await api.delete(`/products/${id}`);
      fetchData();
      Swal.fire({ title: 'Eliminado', text: 'El producto fue eliminado correctamente.', icon: 'success', confirmButtonColor: '#FFAFCC' });
    } catch (err) {
      Swal.fire({ title: 'Error', text: err.response?.data?.message || 'Error al eliminar', icon: 'error', confirmButtonColor: '#e05c7c' });
    }
  }

  return (
    <div className="admin-section">
      <div className="admin-page-header">
        <div>
          <h1>Productos</h1>
          <p>Gestiona el catálogo de productos</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ Nuevo Producto</button>
      </div>

      {loading ? (
        <div className="loading-text">Cargando...</div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Destacado</th>
                <th>Activo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>
                    {p.imagen
                      ? <img src={p.imagen} alt={p.nombre} className="table-thumb" />
                      : <span className="table-thumb-placeholder">🎂</span>
                    }
                  </td>
                  <td>{p.nombre}</td>
                  <td>{p.categoria_nombre || '—'}</td>
                  <td>${parseFloat(p.precio).toFixed(2)}</td>
                  <td><span className={`badge ${p.destacado ? 'badge-yes' : 'badge-no'}`}>{p.destacado ? 'Sí' : 'No'}</span></td>
                  <td><span className={`badge ${p.activo ? 'badge-yes' : 'badge-no'}`}>{p.activo ? 'Sí' : 'No'}</span></td>
                  <td>
                    <div className="table-actions">
                    <button className="btn btn-sm btn-outline" onClick={() => openEdit(p)}>Editar</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.id)}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && <p className="empty-message">No hay productos registrados.</p>}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editing ? 'Editar Producto' : 'Nuevo Producto'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              {error && <div className="alert alert-error">{error}</div>}

              <div className="form-group">
                <label>Nombre *</label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Precio *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.precio}
                    onChange={(e) => setForm({ ...form, precio: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Categoría</label>
                  <select
                    value={form.categoria_id}
                    onChange={(e) => setForm({ ...form, categoria_id: e.target.value })}
                  >
                    <option value="">Sin categoría</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Imagen</label>
                <div
                  className={`dropzone${dragging ? ' dropzone-active' : ''}`}
                  onClick={() => fileInputRef.current.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragging(false);
                    const file = e.dataTransfer.files[0];
                    if (file && file.type.startsWith('image/')) setImageFile(file);
                  }}
                >
                  {imageFile ? (
                    <img src={URL.createObjectURL(imageFile)} alt="preview" className="dropzone-preview" />
                  ) : editing?.imagen ? (
                    <img src={editing.imagen} alt="preview" className="dropzone-preview" />
                  ) : (
                    <div className="dropzone-placeholder">
                      <span className="dropzone-icon">🖼️</span>
                      <p>Arrastra una imagen aquí</p>
                      <span>o haz clic para seleccionar</span>
                    </div>
                  )}
                  {(imageFile || editing?.imagen) && (
                    <div className="dropzone-hint">Haz clic o arrastra para cambiar la imagen</div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => setImageFile(e.target.files[0])}
                />
              </div>

              <div className="form-row form-checks">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={form.destacado}
                    onChange={(e) => setForm({ ...form, destacado: e.target.checked })}
                  />
                  Producto destacado
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={form.activo}
                    onChange={(e) => setForm({ ...form, activo: e.target.checked })}
                  />
                  Activo
                </label>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
