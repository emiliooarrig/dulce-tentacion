import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';

const emptyForm = { nombre: '', email: '', password: '', rol: 'admin', activo: true };

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { user: currentUser } = useAuth();

  async function fetchUsers() {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchUsers(); }, []);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setError('');
    setShowModal(true);
  }

  function openEdit(u) {
    setEditing(u);
    setForm({ nombre: u.nombre, email: u.email, password: '', rol: u.rol, activo: !!u.activo });
    setError('');
    setShowModal(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = { ...form };
      if (editing && !payload.password) delete payload.password;
      if (editing) {
        await api.put(`/users/${editing.id}`, payload);
      } else {
        await api.post('/users', payload);
      }
      setShowModal(false);
      fetchUsers();
      Swal.fire({
        title: editing ? 'Usuario actualizado' : 'Usuario creado',
        text: editing ? 'Los cambios fueron guardados correctamente.' : 'El usuario fue agregado correctamente.',
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
    if (id === currentUser?.id) {
      Swal.fire({ title: 'Acción no permitida', text: 'No puedes eliminar tu propio usuario.', icon: 'error', confirmButtonColor: '#e05c7c' });
      return;
    }
    const result = await Swal.fire({
      title: '¿Eliminar usuario?',
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
      await api.delete(`/users/${id}`);
      fetchUsers();
      Swal.fire({ title: 'Eliminado', text: 'El usuario fue eliminado correctamente.', icon: 'success', confirmButtonColor: '#FFAFCC' });
    } catch (err) {
      Swal.fire({ title: 'Error', text: err.response?.data?.message || 'Error al eliminar', icon: 'error', confirmButtonColor: '#e05c7c' });
    }
  }

  return (
    <div className="admin-section">
      <div className="admin-page-header">
        <div>
          <h1>Usuarios</h1>
          <p>Gestiona los administradores del sistema</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ Nuevo Usuario</button>
      </div>

      {loading ? (
        <div className="loading-text">Cargando...</div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Registrado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.nombre} {u.id === currentUser?.id && <span className="badge badge-you">Tú</span>}</td>
                  <td>{u.email}</td>
                  <td><span className={`badge ${u.rol === 'superadmin' ? 'badge-super' : 'badge-admin'}`}>{u.rol}</span></td>
                  <td><span className={`badge ${u.activo ? 'badge-yes' : 'badge-no'}`}>{u.activo ? 'Activo' : 'Inactivo'}</span></td>
                  <td>{new Date(u.created_at).toLocaleDateString('es-MX')}</td>
                  <td>
                    <div className="table-actions">
                      <button className="btn btn-sm btn-outline" onClick={() => openEdit(u)}>Editar</button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(u.id)}
                        disabled={u.id === currentUser?.id}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && <p className="empty-message">No hay usuarios registrados.</p>}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editing ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
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
                <label>Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>{editing ? 'Nueva contraseña (dejar vacío para no cambiar)' : 'Contraseña *'}</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required={!editing}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Rol</label>
                  <select value={form.rol} onChange={(e) => setForm({ ...form, rol: e.target.value })}>
                    <option value="admin">Admin</option>
                    <option value="superadmin">Super Admin</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="checkbox-label" style={{ marginTop: '1.5rem' }}>
                    <input
                      type="checkbox"
                      checked={form.activo}
                      onChange={(e) => setForm({ ...form, activo: e.target.checked })}
                    />
                    Usuario activo
                  </label>
                </div>
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
