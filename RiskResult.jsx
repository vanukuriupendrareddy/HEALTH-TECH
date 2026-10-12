import { Badge, Card, levelText } from './ui.jsx';

export default function RiskResult({ result }) {
  return (
    <Card className={`result ${result.riskLevel}`}>
      <div className="card-head">
        <h2>Assessment result</h2>
        <Badge level={result.riskLevel}>{levelText[result.riskLevel]}</Badge>
      </div>

      {result.riskLevel === 'emergency' && (
        <div className="alert alert-error" role="alert">
          <b>Contact a veterinarian immediately.</b>
          {result.emergencySymptoms.length > 0 && <> Warning signs entered: {result.emergencySymptoms.join('; ')}.</>}
        </div>
      )}

      <h3>What to do now</h3>
      <ul>{result.advice.map((a) => <li key={a}>{a}</li>)}</ul>

      {result.notes.map((n) => <div key={n} className="alert alert-warn">{n}</div>)}

      <h3>Conditions that match the symptoms entered</h3>
      <p className="muted">The percentage shows how closely the symptoms you entered match each condition’s typical signs. It is not a probability of disease.</p>
      {result.possibleConditions.length === 0 ? (
        <p className="muted">No specific condition matched. Monitor the animal and consult a veterinarian if concerned.</p>
      ) : result.possibleConditions.map((c) => (
        <div key={c.id} style={{ margin: '.8rem 0' }}>
          <div className="card-head" style={{ marginBottom: '.2rem' }}>
            <b>{c.name}</b><span className="muted">{c.matchPercent}% match</span>
          </div>
          <div className="meter" aria-hidden="true"><div style={{ width: `${c.matchPercent}%` }} /></div>
          <p style={{ margin: '.3rem 0' }}>{c.summary}</p>
          <p className="muted" style={{ margin: 0 }}><b>Prevention:</b> {c.prevention}</p>
          <div className="tags">
            {c.contagious && <span className="tag">Contagious</span>}
            {c.zoonotic && <span className="tag">Can spread to humans</span>}
            {c.notifiable && <span className="tag">Reportable</span>}
          </div>
        </div>
      ))}

      <p className="alert alert-info" style={{ marginTop: '1rem' }}>{result.disclaimer}</p>
    </Card>
  );
}
