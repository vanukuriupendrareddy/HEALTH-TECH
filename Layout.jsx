import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

const links = [
  ['/', 'Dashboard'],
  ['/animals', 'My Animals'],
  ['/symptoms', 'Symptom Check'],
  ['/vaccinations', 'Vaccinations'],
  ['/checkups', 'Checkups'],
  ['/vets', 'Vets'],
  ['/learn', 'Learn'],
];

export default function Layout() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const nav = useNavigate();

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">+</span> HEALTH TECH
        </div>
        <button className="menu-btn" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}>
          ☰
        </button>
        <nav className={`nav ${open ? 'open' : ''}`} onClick={() => setOpen(false)}>
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => (isActive ? 'active' : '')}>
              {label}
            </NavLink>
          ))}
          <div className="nav-user">
            <span>{user?.name}</span>
            <button className="btn btn-ghost" onClick={() => { logout(); nav('/login'); }}>Log out</button>
          </div>
        </nav>
      </header>
      <main className="content">
        <Outlet />
      </main>
      <footer className="footer">
        HEALTH TECH is an educational and information-support tool. It does not replace qualified veterinary diagnosis or
        treatment. In an emergency, contact a veterinarian immediately.
      </footer>
    </div>
  );
}
