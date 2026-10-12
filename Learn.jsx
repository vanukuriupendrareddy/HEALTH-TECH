import { useState } from 'react';
import { api } from '../api.js';
import { Alert, Card, SPECIES, useLoad } from '../components/ui.jsx';

export default function Learn() {
  const articles = useLoad(() => api.get('/info/articles'));
  const [species, setSpecies] = useState('cattle');
  const diseases = useLoad(() => api.get(`/info/diseases?species=${species}`), [species]);

  return (
    <>
      <div className="page-head"><div><h1>Farmer education</h1><p>Hygiene, nutrition, biosecurity and preventive care.</p></div></div>
      <Alert>{articles.error}</Alert>

      <Card title="Preventive care guides">
        {articles.loading ? <p className="muted">Loading…</p> : articles.data?.map((a) => (
          <details className="article" key={a.id}>
            <summary>{a.title} <span className="tag">{a.category}</span></summary>
            <ul>{a.points.map((p) => <li key={p}>{p}</li>)}</ul>
          </details>
        ))}
      </Card>

      <Card
        title="Common livestock diseases"
        actions={
          <select aria-label="Species" value={species} onChange={(e) => setSpecies(e.target.value)} style={{ width: 'auto' }}>
            {SPECIES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
          </select>
        }
      >
        <Alert>{diseases.error}</Alert>
        {diseases.loading ? <p className="muted">Loading…</p> : diseases.data?.map((d) => (
          <details className="article" key={d.id}>
            <summary>
              {d.name}{' '}
              {d.contagious && <span className="tag">Contagious</span>}{' '}
              {d.zoonotic && <span className="tag">Zoonotic</span>}{' '}
              {d.notifiable && <span className="tag">Reportable</span>}
            </summary>
            <p>{d.summary}</p>
            <p className="muted"><b>Prevention:</b> {d.prevention}</p>
          </details>
        ))}
        <p className="muted" style={{ marginTop: '.8rem' }}>
          Information is general and educational. Disease patterns and vaccination programmes vary by region; ask your local veterinarian.
        </p>
      </Card>
    </>
  );
}
