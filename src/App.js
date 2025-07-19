import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Bio from './components/Bio';
import Clips from './components/Clips';
import Social from './components/Social';
import PCSpecs from './components/PCSpecs';
// import Blog from './components/Blog';
import Footer from './components/Footer';
import GunBuilds from './pages/GunBuilds';
import { createPortal } from 'react-dom';
import config from './config';

function ModManagerModal({ onClose }) {
  const [mods, setMods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [adding, setAdding] = useState(false);
  const [removing, setRemoving] = useState('');

  useEffect(() => {
    fetchMods();
    // eslint-disable-next-line
  }, []);

  async function fetchMods() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${config.API_BASE_URL}${config.API_ENDPOINTS.mods}`, { headers: { 'x-admin-session': 'imow' } });
      if (!res.ok) throw new Error('Failed to fetch mods');
      const data = await res.json();
      setMods(data);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }

  async function handleAdd(e) {
    e.preventDefault();
    setAdding(true);
    setError('');
    try {
      const res = await fetch(`${config.API_BASE_URL}${config.API_ENDPOINTS.mods}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-session': 'imow' },
        body: JSON.stringify({ username: username.trim(), password: password.trim() })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add mod');
      setUsername('');
      setPassword('');
      fetchMods();
    } catch (e) {
      setError(e.message);
    }
    setAdding(false);
  }

  async function handleRemove(modUsername) {
    if (!window.confirm(`Remove mod '${modUsername}'?`)) return;
    setRemoving(modUsername);
    setError('');
    try {
      const res = await fetch(`${config.API_BASE_URL}${config.API_ENDPOINTS.mods}/${modUsername}`, {
        method: 'DELETE',
        headers: { 'x-admin-session': 'imow' }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to remove mod');
      fetchMods();
    } catch (e) {
      setError(e.message);
    }
    setRemoving('');
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={onClose}>
      <div className="relative w-full max-w-xl bg-card-bg rounded-lg p-10" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-gaming mb-4">Mod Management</h2>
        {error && <div className="text-red-400 font-bold mb-2">{error}</div>}
        <form onSubmit={handleAdd} className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white"
            required
          />
          <button className="cyber-button px-4 py-2 text-xs" type="submit" disabled={adding}>Add</button>
        </form>
        <div className="mb-2 text-gray-300 font-bold">Current Mods:</div>
        {loading ? (
          <div className="text-neon-blue animate-pulse">Loading...</div>
        ) : mods.length === 0 ? (
          <div className="text-gray-400">No mods yet.</div>
        ) : (
          <ul className="space-y-2">
            {mods.map(mod => (
              <li key={mod.username} className="flex items-center justify-between bg-gray-800 rounded px-3 py-2">
                <span className="text-white text-sm">{mod.username}</span>
                <button
                  className="text-xs text-red-400 hover:text-red-600 border border-red-400 rounded px-2 py-1 ml-2"
                  onClick={() => handleRemove(mod.username)}
                  disabled={removing === mod.username}
                >
                  {removing === mod.username ? 'Removing...' : 'Remove'}
                </button>
              </li>
            ))}
          </ul>
        )}
        <button className="absolute top-2 right-2 text-lg font-bold" onClick={onClose}>×</button>
      </div>
    </div>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('isAdmin') === 'true');
  const [adminUsername, setAdminUsername] = useState(() => localStorage.getItem('adminUsername') || 'imow');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showModManager, setShowModManager] = useState(false);

  useEffect(() => {
    // Simulate loading time for smooth animations
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    // Listen for admin login modal open from footer
    const handler = () => setShowAdminLogin(true);
    window.openAdminLogin = handler;
    return () => clearTimeout(timer);
  }, []);

  function handleAdminLogin(e) {
    e.preventDefault();
    const username = e.target.username.value.trim();
    const password = e.target.password.value.trim();
    // Try backend login for admin and mods
    fetch(`${config.API_BASE_URL}${config.API_ENDPOINTS.modsLogin}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
      .then(async res => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'Invalid credentials');
        }
        return res.json();
      })
      .then(data => {
        if (data.role === 'admin') {
          setIsAdmin(true);
          setAdminUsername('imow');
          localStorage.setItem('isAdmin', 'true');
          localStorage.setItem('adminUsername', 'imow');
        } else if (data.role === 'mod') {
          setIsAdmin(true);
          setAdminUsername(username);
          localStorage.setItem('isAdmin', 'true');
          localStorage.setItem('adminUsername', username);
        }
        setShowAdminLogin(false);
        window.location.replace(window.location.pathname); // Stay on the same page after login
      })
      .catch(err => {
        alert(err.message);
      });
  }
  function handleAdminLogout() {
    setIsAdmin(false);
    setAdminUsername('');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminUsername');
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl font-gaming text-neon-blue animate-pulse mb-4">IMOW</div>
          <div className="w-16 h-16 border-4 border-neon-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Navbar isAdmin={isAdmin && adminUsername === 'imow'} onOpenModManager={() => setShowModManager(true)} />
      <main>
        {showAdminLogin && createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={() => setShowAdminLogin(false)}>
            <div className="relative w-full max-w-xs bg-card-bg rounded-lg p-8" onClick={e => e.stopPropagation()}>
              <h2 className="text-2xl font-gaming mb-4">Admin Login</h2>
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <label className="block mb-1 text-sm">Username</label>
                  <input name="username" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg" autoFocus />
                </div>
                <div>
                  <label className="block mb-1 text-sm">Password</label>
                  <input name="password" type="password" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg" />
                </div>
                <button className="cyber-button w-full" type="submit">Login</button>
              </form>
              <button className="absolute top-2 right-2 text-lg font-bold" onClick={() => setShowAdminLogin(false)}>×</button>
            </div>
          </div>,
          document.body
        )}
        {showModManager && (
          <ModManagerModal onClose={() => setShowModManager(false)} />
        )}
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <Bio />
              <Clips />
              <Social />
              <PCSpecs />
              {/* <Blog /> */}
            </>
          } />
          <Route path="/gun-builds" element={<GunBuilds isAdmin={isAdmin} onAdminLogout={handleAdminLogout} />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App; 