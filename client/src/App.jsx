import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Sun, Moon, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

// Navigation Bar component
function Navigation({ darkMode, toggleDarkMode }) {
  return (
    <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400">
            Samaagum
          </Link>
          <nav className="flex space-x-4 text-sm font-medium">
            <Link
              to="/"
              className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition"
            >
              About
            </Link>
          </nav>
        </div>

        {/* Dark Mode Toggle Button */}
        <button
          onClick={toggleDarkMode}
          type="button"
          aria-label="Toggle dark mode"
          className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition flex items-center space-x-2 text-sm"
        >
          {darkMode ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-indigo-600" />
              <span>Dark Mode</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}

// Home Page component
function HomePage() {
  const [healthStatus, setHealthStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetches via Vite proxy configured in vite.config.js (/api -> http://localhost:3000)
      const res = await fetch('/api/health');
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }
      const data = await res.json();
      setHealthStatus(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div className="py-12 px-4 max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Samaagum Monorepo Skeleton
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          React + Vite + Tailwind CSS with React Router and Dark Mode
        </p>
      </div>

      {/* Server Health Card */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Backend Server Status
          </h2>
          <button
            onClick={checkHealth}
            disabled={loading}
            className="flex items-center space-x-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Re-check</span>
          </button>
        </div>

        {loading ? (
          <div className="flex items-center space-x-2 text-slate-500 text-sm">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Checking server /health route...</span>
          </div>
        ) : error ? (
          <div className="flex items-center space-x-2 text-rose-600 dark:text-rose-400 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>Cannot reach server ({error}). Make sure the Fastify server is running on port 3000.</span>
          </div>
        ) : (
          <div className="flex items-center space-x-3 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg p-3">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <div>
              <span className="font-semibold text-sm">Fastify Server is Healthy!</span>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Response: <code className="font-mono bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">{JSON.stringify(healthStatus)}</code>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Feature Verification Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <h3 className="font-medium text-slate-900 dark:text-white mb-1">Tailwind CSS & Dark Mode</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Tailwind CSS class-based dark mode toggle with persistent state.
          </p>
        </div>
        <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <h3 className="font-medium text-slate-900 dark:text-white mb-1">React Router</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Client-side routing enabled with dynamic view transitions.
          </p>
        </div>
        <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <h3 className="font-medium text-slate-900 dark:text-white mb-1">Fastify API & CORS</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Node.js Fastify backend on port 3000 with CORS and .env configuration.
          </p>
        </div>
      </div>
    </div>
  );
}

// About Page component
function AboutPage() {
  return (
    <div className="py-12 px-4 max-w-4xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          About Samaagum
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Phase 1: Project Skeleton
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 text-sm text-slate-600 dark:text-slate-300">
        <p>
          This is the foundation skeleton for Samaagum, structured as a clean monorepo with separate <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">client</code> and <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">server</code> applications.
        </p>
        <p>
          Routing is powered by <strong>React Router</strong>, styling by <strong>Tailwind CSS</strong>, and the backend is an ES modules <strong>Fastify</strong> server with CORS and environment variable support.
        </p>
        <div>
          <Link
            to="/"
            className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
          >
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

// Main App component
export default function App() {
  // Dark mode state with localStorage persistence
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
        <Navigation darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
