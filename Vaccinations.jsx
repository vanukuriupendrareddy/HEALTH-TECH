import { useState } from 'react';
import { api } from '../api.js';
import { Alert, Badge, Card, Empty, Field, animalLabel, fmtDate, toInputDate, useLoad } from '../components/ui.jsx';

export default function Vaccinations() {
  const [status, setStatus] = useState('');
  const list = useLoad(() => api.get(`/vaccinations${status ? `?status=${status}` : ''}`), [status]);
  const animals = useLoad(() => api.get('/animals'));
  const [form, setForm] = useState({ animal: '', vaccine: '', dueDate: '', notes: '' });
  const [error, setError] = useState('');

  const add = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/vaccinations', form);
      setForm({ animal: '', vaccine: '', dueDate: '', notes: '' });
      list.reload();
    } catch (err) { setError(err.message); }
  };

  const markGiven = async (v) => {
    const date = window.prompt('Date given (YYYY-MM-DD)', toInputDate(new Date()));
    if (!date) return;
    if (Number.isNaN(new Date(date).getTime())) return setError('Invalid date');
    const by = window.prompt('Administered by (optional)') || undefined;
    await api.patch(`/vaccinations/${v._id}`, { givenDate: date, administeredBy: by }).catch((e) => setError(e.message));
    list.reload();
  };

  const del = async (v) => {
    if (!window.confirm('Delete this reminder?')) return;
    await api.del(`/vaccinations/${v._id}`).catch((e) => setError(e.message));
    list.reload();
  };

  return (
    <>
      <div className="page-head"><div><h1>Vaccination reminders</h1><p>Track due, overdue and completed vaccinations. Confirm schedules with your veterinarian.</p></div></div>
      <Alert>{error || list.error}</Alert>

      <Card title="Add vaccination reminder">
        <form className="form" onSubmit={add}>
          <div className="form-grid">
            <Field label="Animal">
              <select required value={form.animal} onChange={(e) => setForm({ ...form, animal: e.target.value })}>
                <option value="">Select…</option>
                {animals.data?.map((a) => <option key={a._id} value={a._id}>{animalLabel(a)}</option>)}
              </select>
            </Field>
            <Field label="Vaccine"><input required value={form.vaccine} onChange={(e) => setForm({ ...form, vaccine: e.target.value })} placeholder="e.g. FMD" /></Field>
            <Field label="Due date"><input type="date" required value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} /></Field>
            <Field label="Notes"><input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></Field>
          </div>
          <div><button className="btn">Add reminder</button></div>
        </form>
      </Card>

      <div className="toolbar">
        <select aria-label="Filter status" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All</option><option value="pending">Pending</option><option value="overdue">Overdue</option><option value="done">Completed</option>
        </select>
      </div>

      <Card>
        {list.loading ? <p className="muted">Loading…</p> : !list.data?.length ? <Empty>No vaccinations found.</Empty> : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Animal</th><th>Vaccine</th><th>Due</th><th>Status</th><th /></tr></thead>
              <tbody>
                {list.data.map((v) => {
                  const overdue = !v.givenDate && new Date(v.dueDate) < new Date();
                  return (
                    <tr key={v._id}>
                      <td>{animalLabel(v.animal)}</td>
                      <td>{v.vaccine}{v.notes && <div className="muted">{v.notes}</div>}</td>
                      <td>{fmtDate(v.dueDate)}</td>
                      <td>{v.givenDate ? <Badge level="done">Given {fmtDate(v.givenDate)}</Badge> : <Badge level={overdue ? 'overdue' : 'pending'}>{overdue ? 'Overdue' : 'Pending'}</Badge>}</td>
                      <td>
                        <div className="row-actions">
                          {!v.givenDate && <button className="btn btn-sm" onClick={() => markGiven(v)}>Mark given</button>}
                          <button className="btn btn-sm btn-danger" onClick={() => del(v)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}
