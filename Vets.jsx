import { useState } from 'react';
import { api } from '../api.js';
import { Alert, Card, Empty, Field, useLoad } from '../components/ui.jsx';

const blank = { name: '', clinic: '', phone: '', village: '', specialization: '', emergency24x7: false, notes: '' };

export default function Vets() {
  const vets = useLoad(() => api.get('/info/vets'));
  const resources = useLoad(() => api.get('/info/resources'));
  const [form, setForm] = useState(blank);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  const save = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editId) await api.put(`/info/vets/${editId}`, form);
      else await api.post('/info/vets', form);
      setForm(blank); setEditId(null); vets.reload();
    } catch (err) { setError(err.message); }
  };

  const edit = (v) => { setEditId(v._id); setForm({ ...blank, ...v }); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const del = async (v) => {
    if (!window.confirm(`Remove ${v.name}?`)) return;
    await api.del(`/info/vets/${v._id}`).catch((e) => setError(e.message));
    vets.reload();
  };

  return (
    <>
      <div className="page-head"><div><h1>Veterinary contacts</h1><p>Keep your vets and emergency numbers one tap away.</p></div></div>
      <Alert type="warn">In an emergency, call your veterinarian directly. Save the number of at least one 24×7 vet here.</Alert>
      <Alert>{error || vets.error}</Alert>

      <Card title={editId ? 'Edit vet' : 'Add vet / clinic'}>
        <form className="form" onSubmit={save}>
          <div className="form-grid">
            <Field label="Name *"><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
            <Field label="Phone *"><input required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
            <Field label="Clinic / hospital"><input value={form.clinic || ''} onChange={(e) => setForm({ ...form, clinic: e.target.value })} /></Field>
            <Field label="Village / town"><input value={form.village || ''} onChange={(e) => setForm({ ...form, village: e.target.value })} /></Field>
            <Field label="Specialization"><input value={form.specialization || ''} onChange={(e) => setForm({ ...form, specialization: e.target.value })} placeholder="Large animal, poultry…" /></Field>
            <Field label="Notes"><input value={form.notes || ''} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></Field>
          </div>
          <label className="check"><input type="checkbox" checked={!!form.emergency24x7} onChange={(e) => setForm({ ...form, emergency24x7: e.target.checked })} /> Available for emergencies 24×7</label>
          <div className="row-actions">
            <button className="btn">{editId ? 'Update' : 'Save contact'}</button>
            {editId && <button type="button" className="btn btn-outline" onClick={() => { setEditId(null); setForm(blank); }}>Cancel</button>}
          </div>
        </form>
      </Card>

      <div className="grid grid-2">
        {vets.loading ? <p className="muted">Loading…</p> : !vets.data?.length ? (
          <Card><Empty>No vets saved yet.</Empty></Card>
        ) : vets.data.map((v) => (
          <Card key={v._id}>
            <div className="card-head">
              <h2>{v.name}</h2>
              {v.emergency24x7 && <span className="badge badge-emergency">24×7</span>}
            </div>
            {v.clinic && <div>{v.clinic}</div>}
            <div className="muted">{[v.specialization, v.village].filter(Boolean).join(' · ')}</div>
            {v.notes && <p className="muted">{v.notes}</p>}
            <div className="row-actions" style={{ marginTop: '.6rem' }}>
              <a className="btn btn-sm" href={`tel:${v.phone}`}>Call {v.phone}</a>
              <button className="btn btn-sm btn-outline" onClick={() => edit(v)}>Edit</button>
              <button className="btn btn-sm btn-danger" onClick={() => del(v)}>Remove</button>
            </div>
          </Card>
        ))}
      </div>

      {resources.data?.length > 0 && (
        <Card title="Helplines">
          <ul className="list">
            {resources.data.map((r) => (
              <li key={r.name}>
                <span><b>{r.name}</b><br /><span className="muted">{r.note}</span></span>
                <a href={`tel:${r.phone.replace(/[^\d+]/g, '')}`}>{r.phone}</a>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </>
  );
}
