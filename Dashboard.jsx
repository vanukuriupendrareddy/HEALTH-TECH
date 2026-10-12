import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { Alert, Badge, Card, Empty, animalLabel, fmtDate, fmtDateTime, speciesLabel, useLoad } from '../components/ui.jsx';

export default function Dashboard() {
  const { data, error, loading } = useLoad(() => api.get('/dashboard'));

  if (loading) return <p className="muted">Loading dashboard…</p>;
  if (error) return <Alert>{error}</Alert>;

  const sick = (data.byStatus['sick'] || 0) + (data.byStatus['under-observation'] || 0);

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Farm dashboard</h1>
          <p>Overview of your livestock health, reminders and recent activity.</p>
        </div>
        <Link className="btn" to="/animals">+ Add animal</Link>
      </div>

      <div className="grid grid-4" style={{ marginBottom: '1rem' }}>
        <div className="stat"><b>{data.totalAnimals}</b><span>Animals / flocks</span></div>
        <div className={`stat ${sick ? 'warn' : ''}`}><b>{sick}</b><span>Sick or under observation</span></div>
        <div className={`stat ${data.overdueVaccinations.length ? 'warn' : ''}`}><b>{data.overdueVaccinations.length}</b><span>Overdue vaccinations</span></div>
        <div className="stat"><b>{data.upcomingCheckups.length}</b><span>Upcoming checkups</span></div>
      </div>

      {data.totalAnimals === 0 && (
        <Alert type="info">You have no animals yet. <Link to="/animals">Add your first animal</Link> to start tracking health and vaccinations.</Alert>
      )}

      <div className="grid grid-2">
        <Card title="Vaccinations needing attention" actions={<Link to="/vaccinations">View all</Link>}>
          {data.overdueVaccinations.length + data.upcomingVaccinations.length === 0 ? (
            <Empty>No overdue or upcoming vaccinations in the next 30 days.</Empty>
          ) : (
            <ul className="list">
              {data.overdueVaccinations.map((v) => (
                <li key={v._id}>
                  <span><b>{v.vaccine}</b><br /><span className="muted">{animalLabel(v.animal)}</span></span>
                  <span><Badge level="overdue">Overdue</Badge><br /><span className="muted">{fmtDate(v.dueDate)}</span></span>
                </li>
              ))}
              {data.upcomingVaccinations.map((v) => (
                <li key={v._id}>
                  <span><b>{v.vaccine}</b><br /><span className="muted">{animalLabel(v.animal)}</span></span>
                  <span><Badge level="pending">Due</Badge><br /><span className="muted">{fmtDate(v.dueDate)}</span></span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Upcoming veterinary checkups" actions={<Link to="/checkups">View all</Link>}>
          {data.upcomingCheckups.length === 0 ? (
            <Empty>No checkups scheduled.</Empty>
          ) : (
            <ul className="list">
              {data.upcomingCheckups.map((c) => (
                <li key={c._id}>
                  <span><b>{c.reason}</b><br /><span className="muted">{animalLabel(c.animal)}</span></span>
                  <span className="muted">{fmtDateTime(c.scheduledAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Herd composition">
          {data.totalAnimals === 0 ? <Empty>Nothing to show yet.</Empty> : (
            <ul className="list">
              {Object.entries(data.bySpecies).map(([s, n]) => (
                <li key={s}><span>{speciesLabel(s)}</span><b>{n}</b></li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Recent health records" actions={<Link to="/symptoms">Check symptoms</Link>}>
          {data.recentRecords.length === 0 ? (
            <Empty>No health records yet.</Empty>
          ) : (
            <ul className="list">
              {data.recentRecords.map((r) => (
                <li key={r._id}>
                  <span><b>{animalLabel(r.animal)}</b><br /><span className="muted">{r.symptoms?.length ? r.symptoms.join(', ').replaceAll('_', ' ') : r.description || r.type}</span></span>
                  <span>{r.riskLevel && <Badge level={r.riskLevel} />}<br /><span className="muted">{fmtDate(r.date)}</span></span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
