import { useState } from 'react';
import { api } from '../api.js';
import { Alert, Badge, Card, Empty, Field, animalLabel, fmtDateTime, useLoad } from '../components/ui.jsx';

const blank = { animal: '', scheduledAt: '', reason: '', vetName: '', vetPhone: '' };

export default function Checkups() {
  const list = useLoad(() => api.get('/checkups'));
  const animals = useLoad(() => api.get('/animals'));
  const vets = useLoad(() => api.get('/info/vets'));
  const [form, setForm] = useState(blank);
  const [error, setError] = useState('');

  const pickVet = (e) => {
    const v = vets.data?.find((x) => x._id === e.target.value);
    if (v) setForm({ ...form, vetName: v.name, vetPhone: v.phone });
  };

  const add = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/checkups', form);
      setForm(blank);
      list.reload();
    } catch (err) { setError(err.message); }
  };

  const setStatus = async (c, status) => {
    let outcome;
    if (status === 'completed') outcome = window.prompt('Outcome / vet advice (optional)') || undefined;
    await api.patch(`/checkups/${c._id}`, { status, outcome }).catch((e) => setError(e.message));
    list.reload();
  };

  const del = async (c) => {
    if (!window.confirm('Delete this checkup?')) return;
    await api.del(`/checkups/${c._id}`).catch((e) => setError(e.message));
    list.reload();
  };

  return (
    <>
      <div className="page-head"><div><h1>Veterinary checkups</h1><p>Schedule and track visits so problems are caught early.</p></div></div>
      <Alert>{error || list.error}</Alert>

      <Card title="Schedule a checkup">
        <form className="form" onSubmit={add}>
          <div className="form-grid">
            <Field label="Animal">
              <select required value={form.animal} onChange={(e) => setForm({ ...form, animal: e.target.value })}>
                <option value="">Select…</option>
                {animals.data?.map((a) => <option key={a._id} value={a._id}>{animalLabel(a)}</option>)}
              </select>
            </Field>
            <Field label="Date & time"><input type="datetime-local" required value={form.scheduledAt} onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })} /></Field>
            <Field label="Reason"><input required maxLength={300} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="Routine check, pregnancy check, lameness…" /></Field>
            <Field label="Saved vet (optional)">
              <select defaultValue="" onChange={pickVet}>
                <option value="">Choose from your vets…</option>
                {vets.data?.map((v) => <option key={v._id} value={v._id}>{v.name}</option>)}
              </select>
            </Field>
            <Field label="Vet name"><input value={form.vetName} onChange={(e) => setForm({ ...form, vetName: e.target.value })} /></Field>
            <Field label="Vet phone"><input value={form.vetPhone} onChange={(e) => setForm({ ...form, vetPhone: e.target.value })} /></Field>
          </div>
          <div><button className="btn">Schedule</button></div>
        </form>
      </Card>

      <Card>
        {list.loading ? <p className="muted">Loading…</p> : !list.data?.length ? <Empty>No checkups scheduled.</Empty> : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>When</th><th>Animal</th><th>Reason</th><th>Vet</th><th>Status</th><th /></tr></thead>
              <tbody>
                {list.data.map((c) => (
                  <tr key={c._id}>
                    <td>{fmtDateTime(c.scheduledAt)}</td>
                    <td>{animalLabel(c.animal)}</td>
                    <td>{c.reason}{c.outcome && <div className="muted">Outcome: {c.outcome}</div>}</td>
                    <td>{c.vetName || '—'}{c.vetPhone && <div><a href={`tel:${c.vetPhone}`}>{c.vetPhone}</a></div>}</td>
                    <td><Badge level={c.status}>{c.status}</Badge></td>
                    <td>
                      <div className="row-actions">
                        {c.status === 'scheduled' && <button className="btn btn-sm" onClick={() => setStatus(c, 'completed')}>Complete</button>}
                        {c.status === 'scheduled' && <button className="btn btn-sm btn-outline" onClick={() => setStatus(c, 'cancelled')}>Cancel</button>}
                        <button className="btn btn-sm btn-danger" onClick={() => del(c)}>Delete</button>
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
