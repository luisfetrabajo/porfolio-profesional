import { useState, useCallback, ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, LogIn, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useClickCounter } from '../hooks';
import { NAV_LINKS, SITE_CONFIG } from '../utils/constants';

export default function MainLayout({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [easterEgg, setEasterEgg] = useState(false);
  const location = useLocation();
  const { user, isAdmin, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleEasterEgg = useCallback(() => {
    setEasterEgg(true);
    setTimeout(() => setEasterEgg(false), 4000);
  }, []);

  const onFooterClick = useClickCounter(handleEasterEgg, 5, 2000);

  return (
    <div className="app-layout">
      <nav className="navbar">
        <div className="navbar-inner">
          <Link to="/" className="navbar-brand">
            <span className="brand-icon">&#9876;</span>
            <span className="brand-text">Luis F.</span>
          </Link>

          <div className="navbar-links-desktop">
            {NAV_LINKS.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${location.pathname === link.path ? 'nav-link--active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link to="/admin" className={`nav-link ${location.pathname.startsWith('/admin') ? 'nav-link--active' : ''}`}>
                <Shield size={14} /> Admin
              </Link>
            )}
          </div>

          <div className="navbar-actions">
            <button onClick={toggleTheme} className="icon-btn" title="Cambiar tema">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            {user ? (
              <button onClick={signOut} className="icon-btn" title="Cerrar sesión">
                <LogOut size={18} />
              </button>
            ) : (
              <Link to="/login" className="icon-btn" title="Iniciar sesión">
                <LogIn size={18} />
              </Link>
            )}
            <button onClick={() => setMenuOpen(!menuOpen)} className="icon-btn hamburger">
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {NAV_LINKS.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`mobile-link ${location.pathname === link.path ? 'mobile-link--active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link to="/admin" className="mobile-link" onClick={() => setMenuOpen(false)}>
                Admin
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="main-content">
        {children}
      </main>

      <footer className="lotr-footer" onClick={onFooterClick}>
        <div className="lotr-divider" style={{ marginBottom: '20px' }} />
        <div className="footer-links">
          <a href={SITE_CONFIG.github} target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href={SITE_CONFIG.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href={`mailto:${SITE_CONFIG.email}`}>Contacto</a>
        </div>
        <p className="footer-copy">&copy; {new Date().getFullYear()} Luis F. Forjado con la tematica de LOTR.</p>
        <p className="footer-quote">"No todos los que vagan se pierden." — J.R.R. Tolkien</p>
        <p className="footer-quote">"si has leido esto pulsa varias veces." </p>
        

        <AnimatePresence>
          {easterEgg && (
            <motion.div
              className="easter-egg"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: 'spring', duration: 0.6 }}
            >
              <div className="easter-egg-content">
                <span className="easter-egg-flag">&#9876;</span>
                <p className="easter-egg-text">¡El One Piece existe!</p>
                <div className="confetti">
                  {Array.from({ length: 30 }).map((_, i) => (
                    <span
                      key={i}
                      className="confetti-piece"
                      style={{
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 0.5}s`,
                        backgroundColor: ['#c9a227', '#e8c547', '#ff6b6b', '#4ecdc4', '#45b7d1'][i % 5],
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </footer>
    </div>
  );
}
