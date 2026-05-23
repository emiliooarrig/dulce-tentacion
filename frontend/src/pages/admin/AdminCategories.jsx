import { useEffect, useState } from 'react';
import api from '../../services/api';
import Swal from 'sweetalert2';

const emptyForm = { nombre: '', descripcion: '' };

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function fetchCategories() {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchCategories(); }, []);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setError('');
    setShowModal(true);
  }

  function openEdit(c) {
    setEditing(c);
    setForm({ nombre: c.nombre, descripcion: c.descripcion || '' });
    setError('');
    setShowModal(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/categories/${editing.id}`, form);
      } else {
        await api.post('/categories', form);
      }
      setShowModal(false);
      fetchCategories();
      Swal.fire({
        title: editing ? 'Categoría actualizada' : 'Categoría creada',
        text: editing ? 'Los cambios fueron guardados correctamente.' : 'La categoría fue agregada correctamente.',
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
      title: '¿Eliminar categoría?',
      text: 'Los productos asociados quedarán sin categoría.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#e05c7c',
      cancelButtonColor: '#CDB4DB',
    });
    if (!result.isConfirmed) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
      Swal.fire({ title: 'Eliminada', text: 'La categoría fue eliminada correctamente.', icon: 'success', confirmButtonColor: '#FFAFCC' });
    } catch (err) {
      Swal.fire({ title: 'Error', text: err.response?.data?.message || 'Error al eliminar', icon: 'error', confirmButtonColor: '#e05c7c' });
    }
  }

  return (
    <div className="admin-section">
      <div className="admin-page-header">
        <div>
          <h1>Categorías</h1>
          <p>Organiza los productos por categorías</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ Nueva Categoría</button>
      </div>

      {loading ? (
        <div className="loading-text">Cargando...</div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Creada</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td><strong>{c.nombre}</strong></td>
                  <td>{c.descripcion || '—'}</td>
                  <td>{new Date(c.created_at).toLocaleDateString('es-MX')}</td>
                  <td>
                    <div className="table-actions">
                      <button className="btn btn-sm btn-outline" onClick={() => openEdit(c)}>Editar</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(c.id)}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {categories.length === 0 && <p className="empty-message">No hay categorías registradas.</p>}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editing ? 'Editar Categoría' : 'Nueva Categoría'}</h2>
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
