import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { Alert, Badge, Card, Empty, Field, SPECIES, fmtDate, speciesLabel, toInputDate, useLoad } from '../components/ui.jsx';

const blank = { tagId: '', name: '', species: 'cattle', breed: '', sex: 'female', dateOfBirth: '', weightKg: '', flockSize: '', notes: '' };

export default function Animals() {
  const [filter, setFilter] = useState('');
  const { data, error, loading, reload } = useLoad(() => api.get(`/animals${filter ? `?species=${filter}` : ''}`), [filter]);
  const [form, setForm] = useState(null); // null = hidden; object = editing
  const [editId, setEditId] = useState(null);
  const [formError, setFormError] = useState('');

  const open = (animal) => {
    setFormError('');
    if (animal) {
      setEditId(animal._id);
      setForm({ ...blank, ...animal, dateOfBirth: toInputDate(animal.dateOfBirth), weightKg: animal.weightKg ?? '', flockSize: animal.flockSize ?? '' });
    } else {
      setEditId(null);
      setForm({ ...blank });
    }
  };
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const save = async (e) => {
    e.preventDefault();
    setFormError('');
    const payload = { ...form };
    ['weightKg', 'flockSize'].forEach((k) => { payload[k] = payload[k] === '' ? undefined : Number(payload[k]); });
    if (!payload.dateOfBirth) delete payload.dateOfBirth;
    try {
      if (editId) await api.put(`/animals/${editId}`, payload);
      else await api.post('/animals', payload);
      setForm(null);
      reload();
    } catch (err) {
      setFormError(err.message);
    }
  };

  const remove = async (a) => {
    if (!window.confirm(`Delete ${a.tagId}? All its health records, vaccinations and checkups will be deleted too.`)) return;
    try { await api.del(`/animals/${a._id}`); reload(); } catch (err) { alert(err.message); }
  };

  return (
    <>
      <div className="page-head">
        <div><h1>My animals</h1><p>Register cattle, buffaloes, goats, sheep and poultry flocks.</p></div>
        <button className="btn" onClick={() => open(null)}>+ Add animal</button>
      </div>

      {form && (
        <Card title={editId ? 'Edit animal' : 'Add animal'}>
          <Alert>{formError}</Alert>
          <form className="form" onSubmit={save}>
            <div className="form-grid">
              <Field label="Tag / ID *" hint="Ear tag number or flock name"><input required value={form.tagId} onChange={set('tagId')} /></Field>
              <Field label="Name"><input value={form.name || ''} onChange={set('name')} /></Field>
              <Field label="Species *">
                <select value={form.species} onChange={set('species')}>{SPECIES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>
              </Field>
              <Field label="Breed"><input value={form.breed || ''} onChange={set('breed')} /></Field>
              <Field label="Sex">
                <select value={form.sex} onChange={set('sex')}><option value="female">Female</option><option value="male">Male</option></select>
              </Field>
              <Field label="Date of birth"><input type="date" value={form.dateOfBirth} onChange={set('dateOfBirth')} /></Field>
              <Field label="Weight (kg)"><input type="number" min="0" step="0.1" value={form.weightKg} onChange={set('weightKg')} /></Field>
              {form.species === 'poultry' && (
                <Field label="Flock size"><input type="number" min="1" value={form.flockSize} onChange={set('flockSize')} /></Field>
              )}
              {editId && (
                <Field label="Status">
                  <select value={form.status} onChange={set('status')}>
                    {['healthy', 'under-observation', 'sick', 'sold', 'deceased'].map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </Field>
              )}
            </div>
            <Field label="Notes"><textarea value={form.notes || ''} onChange={set('notes')} maxLength={500} /></Field>
            <div className="row-actions">
              <button className="btn">Save</button>
              <button type="button" className="btn btn-outline" onClick={() => setForm(null)}>Cancel</button>
            </div>
          </form>
        </Card>
      )}

      <div className="toolbar">
        <select aria-label="Filter by species" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All species</option>
          {SPECIES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
        </select>
      </div>

      <Alert>{error}</Alert>
      <Card>
        {loading ? <p className="muted">Loading…</p> : !data?.length ? (
          <Empty>No animals found. Click “Add animal” to get started.</Empty>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Tag</th><th>Species</th><th>Breed</th><th>Born</th><th>Status</th><th /></tr></thead>
              <tbody>
                {data.map((a) => (
                  <tr key={a._id}>
                    <td><Link to={`/animals/${a._id}`}><b>{a.tagId}</b></Link>{a.name && <div className="muted">{a.name}</div>}</td>
                    <td>{speciesLabel(a.species)}{a.species === 'poultry' && a.flockSize ? ` (${a.flockSize})` : ''}</td>
                    <td>{a.breed || '—'}</td>
                    <td>{fmtDate(a.dateOfBirth)}</td>
                    <td><Badge level={a.status}>{a.status}</Badge></td>
                    <td>
                      <div className="row-actions">
                        <Link className="btn btn-sm btn-outline" to={`/animals/${a._id}`}>Open</Link>
                        <button className="btn btn-sm btn-outline" onClick={() => open(a)}>Edit</button>
                        <button className="btn btn-sm btn-danger" onClick={() => remove(a)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}
