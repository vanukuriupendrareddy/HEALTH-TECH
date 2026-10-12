import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api.js';
import RiskResult from '../components/RiskResult.jsx';
import { Alert, Card, Field, animalLabel, useLoad } from '../components/ui.jsx';

export default function Symptoms() {
  const [params] = useSearchParams();
  const animals = useLoad(() => api.get('/animals'));
  const symptoms = useLoad(() => api.get('/info/symptoms'));

  const [animalId, setAnimalId] = useState(params.get('animal') || '');
  const [selected, setSelected] = useState([]);
  const [temp, setTemp] = useState('');
  const [notes, setNotes] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState('');
  const [busy, setBusy] = useState(false);

  const animal = animals.data?.find((a) => a._id === animalId);
  const visible = useMemo(() => {
    if (!symptoms.data) return [];
    if (!animal) return [];
    const poultry = animal.species === 'poultry';
    return symptoms.data.filter((s) => (poultry ? s.species === 'all' || s.species === 'poultry' : s.species !== 'poultry'));
  }, [symptoms.data, animal]);

  const toggle = (id) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const onAnimal = (e) => { setAnimalId(e.target.value); setSelected([]); setResult(null); setSaved(''); };

  const assess = async (e) => {
    e.preventDefault();
    setError(''); setSaved(''); setBusy(true);
    try {
      setResult(await api.post('/risk/assess', { animalId, symptoms: selected, temperatureC: temp }));
    } catch (err) { setError(err.message); setResult(null); }
    finally { setBusy(false); }
  };

  const save = async () => {
    setError('');
    try {
      await api.post('/records', {
        animal: animalId, type: 'symptom', symptoms: selected,
        temperatureC: temp === '' ? undefined : Number(temp), description: notes,
      });
      setSaved('Saved to the animal’s health history.');
    } catch (err) { setError(err.message); }
  };

  return (
    <>
      <div className="page-head">
        <div><h1>Symptom check</h1><p>Educational risk assessment to help you decide how urgently to call a vet.</p></div>
      </div>
      <Alert type="warn">This tool does not diagnose disease. If your animal is very ill, in pain, or you are worried, call a veterinarian now.</Alert>
      <Alert>{animals.error || symptoms.error}</Alert>

      <Card>
        <form className="form" onSubmit={assess}>
          <Field label="Animal / flock">
            <select required value={animalId} onChange={onAnimal}>
              <option value="">Select an animal…</option>
              {animals.data?.map((a) => <option key={a._id} value={a._id}>{animalLabel(a)}</option>)}
            </select>
          </Field>
          {animals.data && animals.data.length === 0 && <p className="muted">Add an animal first on the “My Animals” page.</p>}

          {animal && (
            <>
              <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
                <legend style={{ fontWeight: 600, marginBottom: '.4rem' }}>Symptoms you observe</legend>
                <div className="symptom-grid">
                  {visible.map((s) => (
                    <label key={s.id}>
                      <input type="checkbox" checked={selected.includes(s.id)} onChange={() => toggle(s.id)} />
                      <span>{s.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <div className="form-grid">
                <Field label="Body temperature (°C)" hint="Optional. Use a digital thermometer.">
                  <input type="number" step="0.1" min="30" max="46" value={temp} onChange={(e) => setTemp(e.target.value)} />
                </Field>
                <Field label="Notes (saved if you store this check)">
                  <input value={notes} maxLength={300} onChange={(e) => setNotes(e.target.value)} />
                </Field>
              </div>
              <div className="row-actions">
                <button className="btn" disabled={busy || selected.length === 0}>{busy ? 'Assessing…' : 'Assess risk'}</button>
              </div>
            </>
          )}
        </form>
      </Card>

      <Alert>{error}</Alert>
      {result && (
        <>
          <RiskResult result={result} />
          <Alert type="success">{saved}</Alert>
          {!saved && <button className="btn btn-outline" onClick={save}>Save to health history</button>}
        </>
      )}
    </>
  );
}
