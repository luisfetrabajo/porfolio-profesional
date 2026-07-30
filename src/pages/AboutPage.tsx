import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GithubService, GithubUser } from '../services/GithubService';
import { SITE_CONFIG } from '../utils/constants';

export default function AboutPage() {
  const [user, setUser] = useState<GithubUser | null>(null);

  useEffect(() => {
    GithubService.getUser().then(setUser).catch(() => {});
  }, []);

  return (
    <section className="lotr-section" style={{ paddingTop: '100px', minHeight: '100vh' }}>
      <motion.h2 className="lotr-title lotr-section-title" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        El Hobbit
      </motion.h2>
      <div className="lotr-divider" />
      <p className="lotr-section-subtitle">Conoce al viajero detrás del código</p>

      <div style={{ maxWidth: '700px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} style={{ marginBottom: '24px', textAlign: 'center' }}>
          <img src={user?.avatar_url || 'https://github.githubassets.com/images/modules/logos_page/Octocat.png'} alt="Luis F." className="lotr-avatar" />
        </motion.div>

        <motion.h2 className="lotr-title" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} style={{ fontSize: '1.8rem', marginBottom: '4px' }}>
          {user?.name || 'Luis F.'}
        </motion.h2>
        <p className="lotr-subtitle" style={{ fontSize: '0.85rem', marginBottom: '20px' }}>Full Stack Developer Junior</p>

        <motion.p className="lotr-text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} style={{ textAlign: 'center', maxWidth: '550px', fontSize: '1rem', marginBottom: '30px' }}>
          {user?.bio || 'Desarrollo aplicaciones increíbles como este portfolio profesional. Cada línea de código es un paso en la travesía.'}
        </motion.p>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', width: '100%', maxWidth: '400px', marginBottom: '30px' }}>
          <div className="lotr-stat">
            <span className="lotr-stat__number">{user?.public_repos || '?'}</span>
            <span className="lotr-stat__label">Repos</span>
          </div>
          <div className="lotr-stat">
            <span className="lotr-stat__number">{user?.followers || '?'}</span>
            <span className="lotr-stat__label">Seguidores</span>
          </div>
          <div className="lotr-stat">
            <span className="lotr-stat__number">{user?.following || '?'}</span>
            <span className="lotr-stat__label">Siguiendo</span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '40px' }}>
          <a href={user?.html_url || SITE_CONFIG.github} target="_blank" rel="noopener noreferrer" className="lotr-btn lotr-btn--primary" style={{ textDecoration: 'none' }}>
            Ver GitHub &rarr;
          </a>
          <a href={`mailto:${SITE_CONFIG.email}`} className="lotr-btn" style={{ textDecoration: 'none' }}>
            Enviar Palantír(Correo)
          </a>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} style={{ marginTop: '20px', padding: '30px', borderLeft: '3px solid var(--lotr-gold)', background: 'rgba(201, 162, 39, 0.03)', borderRadius: '0 8px 8px 0', maxWidth: '500px' }}>
          <p style={{ fontFamily: "'Cinzel', serif", color: 'var(--lotr-silver)', fontStyle: 'italic', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
            "Even the smallest person can change the course of the future."
          </p>
          <p style={{ fontFamily: "'Cinzel', serif", color: 'var(--lotr-gold)', fontSize: '0.75rem', marginTop: '8px', opacity: 0.7 }}>
            — Galadriel
          </p>
        </motion.div>
      </div>
    </section>
  );
}
