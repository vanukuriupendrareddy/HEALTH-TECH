import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api.js';
import { Alert, Badge, Card, Empty, Field, fmtDate, speciesLabel, toInputDate, useLoad } from '../components/ui.jsx';

export default function AnimalDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const animal = useLoad(() => api.get(`/animals/${id}`), [id]);
  const records = useLoad(() => api.get(`/records?animal=${id}`), [id]);
  const vaccs = useLoad(() => api.get(`/vaccinations?animal=${id}`), [id]);

  const [note, setNote] = useState({ type: 'note', description: '', treatment: '', vetConsulted: false, temperatureC: '' });
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  if (animal.loading) return <p className="muted">Loading…</p>;
  if (animal.error) return <Alert>{animal.error}</Alert>;
  const a = animal.data;

  const addRecord = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/records', {
        animal: id, ...note,
        temperatureC: note.temperatureC === '' ? undefined : Number(note.temperatureC),
      });
      setNote({ type: 'note', description: '', treatment: '', vetConsulted: false, temperatureC: '' });
      records.reload();
    } catch (err) { setError(err.message); }
  };

  const delRecord = async (rid) => {
    if (!window.confirm('Delete this record?')) return;
    await api.del(`/records/${rid}`).catch((e) => setError(e.message));
    records.reload();
  };

  const makePlan = async () => {
    setError(''); setInfo('');
    try {
      const created = await api.post(`/animals/${id}/vaccination-plan`, {});
      setInfo(`${created.length} vaccination reminders created. Please confirm dates with your veterinarian.`);
      vaccs.reload();
    } catch (e) { setError(e.message); }
  };

  const markStatus = async (status) => {
    await api.put(`/animals/${id}`, { status }).catch((e) => setError(e.message));
    animal.reload();
  };

  return (
    <>
      <div className="page-head">
        <div>
          <p><Link to="/animals">← All animals</Link></p>
          <h1>{a.tagId}{a.name ? ` · ${a.name}` : ''}</h1>
          <p>{speciesLabel(a.species)}{a.breed ? ` · ${a.breed}` : ''} · {a.sex}</p>
        </div>
        <div className="row-actions">
          <Link className="btn" to={`/symptoms?animal=${id}`}>Check symptoms</Link>
          <Link className="btn btn-outline" to="/checkups">Book checkup</Link>
        </div>
      </div>

      <Alert>{error}</Alert>
      <Alert type="success">{info}</Alert>

      <div className="grid grid-2">
        <Card title="Profile">
          <ul className="list">
            <li><span>Status</span><Badge level={a.status}>{a.status}</Badge></li>
            <li><span>Date of birth</span><span>{fmtDate(a.dateOfBirth)}</span></li>
            <li><span>Weight</span><span>{a.weightKg ? `${a.weightKg} kg` : '—'}</span></li>
            {a.species === 'poultry' && <li><span>Flock size</span><span>{a.flockSize || '—'}</span></li>}
            {a.notes && <li><span>Notes</span><span>{a.notes}</span></li>}
          </ul>
          <div className="row-actions" style={{ marginTop: '.6rem' }}>
            {a.status !== 'healthy' && a.status !== 'sold' && a.status !== 'deceased' && (
              <button className="btn btn-sm btn-outline" onClick={() => markStatus('healthy')}>Mark as recovered</button>
            )}
          </div>
        </Card>

        <Card title="Vaccinations" actions={<button className="btn btn-sm btn-outline" onClick={makePlan}>Generate reminders</button>}>
          {vaccs.loading ? <p className="muted">Loading…</p> : !vaccs.data?.length ? (
            <Empty>No vaccinations recorded. “Generate reminders” creates a general template to review with your vet.</Empty>
          ) : (
            <ul className="list">
              {vaccs.data.map((v) => {
                const overdue = !v.givenDate && new Date(v.dueDate) < new Date();
                return (
                  <li key={v._id}>
                    <span>{v.vaccine}</span>
                    {v.givenDate ? <Badge level="done">Given {fmtDate(v.givenDate)}</Badge>
                      : <Badge level={overdue ? 'overdue' : 'pending'}>{overdue ? 'Overdue' : 'Due'} {fmtDate(v.dueDate)}</Badge>}
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>

      <Card title="Add health note / treatment">
        <form className="form" onSubmit={addRecord}>
          <div className="form-grid">
            <Field label="Type">
              <select value={note.type} onChange={(e) => setNote({ ...note, type: e.target.value })}>
                <option value="note">General note</option>
                <option value="illness">Illness</option>
                <option value="treatment">Treatment given</option>
              </select>
            </Field>
            <Field label="Temperature (°C)"><input type="number" step="0.1" min="30" max="46" value={note.temperatureC} onChange={(e) => setNote({ ...note, temperatureC: e.target.value })} /></Field>
          </div>
          <Field label="Description"><textarea required value={note.description} maxLength={1000} onChange={(e) => setNote({ ...note, description: e.target.value })} /></Field>
          <Field label="Treatment / medicine given (as advised by vet)"><input value={note.treatment} onChange={(e) => setNote({ ...note, treatment: e.target.value })} /></Field>
          <label className="check"><input type="checkbox" checked={note.vetConsulted} onChange={(e) => setNote({ ...note, vetConsulted: e.target.checked })} /> Veterinarian consulted</label>
          <div><button className="btn">Add record</button></div>
        </form>
      </Card>

      <Card title="Health history">
        {records.loading ? <p className="muted">Loading…</p> : !records.data?.length ? <Empty>No health records yet.</Empty> : (
          <ul className="list">
            {records.data.map((r) => (
              <li key={r._id}>
                <span style={{ flex: 1, minWidth: 220 }}>
                  <b>{fmtDate(r.date)}</b> <span className="badge badge-neutral">{r.type}</span> {r.riskLevel && <Badge level={r.riskLevel} />}
                  {r.symptoms?.length > 0 && <div>Symptoms: {r.symptoms.join(', ').replaceAll('_', ' ')}</div>}
                  {r.temperatureC && <div className="muted">Temp: {r.temperatureC}°C</div>}
                  {r.description && <div>{r.description}</div>}
                  {r.treatment && <div className="muted">Treatment: {r.treatment}</div>}
                  {r.possibleConditions?.length > 0 && <div className="muted">Matched: {r.possibleConditions.join(', ')}</div>}
                  {r.vetConsulted && <div className="muted">✓ Vet consulted</div>}
                </span>
                <button className="btn btn-sm btn-danger" onClick={() => delRecord(r._id)}>Delete</button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
