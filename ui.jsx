import { useEffect, useState } from 'react';

export const SPECIES = [
  ['cattle', 'Cattle'],
  ['buffalo', 'Buffalo'],
  ['goat', 'Goat'],
  ['sheep', 'Sheep'],
  ['poultry', 'Poultry'],
];
export const speciesLabel = (s) => SPECIES.find(([k]) => k === s)?.[1] || s;

export const fmtDate = (d) => (d ? new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : '—');
export const fmtDateTime = (d) =>
  d ? new Date(d).toLocaleString(undefined, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';
export const toInputDate = (d) => (d ? new Date(d).toISOString().slice(0, 10) : '');
export const animalLabel = (a) => (a ? `${a.tagId}${a.name ? ` · ${a.name}` : ''} (${speciesLabel(a.species)})` : 'Unknown animal');

export function Badge({ level, children }) {
  return <span className={`badge badge-${level}`}>{children || level}</span>;
}

export function Alert({ type = 'error', children }) {
  if (!children) return null;
  return <div className={`alert alert-${type}`} role={type === 'error' ? 'alert' : 'status'}>{children}</div>;
}

export function Empty({ children }) {
  return <p className="empty">{children}</p>;
}

export function Card({ title, actions, children, className = '' }) {
  return (
    <section className={`card ${className}`}>
      {(title || actions) && (
        <div className="card-head">
          {title && <h2>{title}</h2>}
          <div>{actions}</div>
        </div>
      )}
      {children}
    </section>
  );
}

export function Field({ label, children, hint }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  );
}

// Small data-loading hook
export function useLoad(loader, deps = []) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let live = true;
    setLoading(true);
    loader()
      .then((d) => { if (live) { setData(d); setError(''); } })
      .catch((e) => live && setError(e.message))
      .finally(() => live && setLoading(false));
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);

  return { data, error, loading, reload: () => setTick((t) => t + 1) };
}

export const levelText = {
  low: 'Low risk',
  moderate: 'Moderate risk',
  high: 'High risk',
  emergency: 'EMERGENCY',
};
