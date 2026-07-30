import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Download, ExternalLink } from 'lucide-react';
import { ProjectService } from '../services/ProjectService';
import { GithubService, GithubRepo } from '../services/GithubService';
import { SITE_CONFIG } from '../utils/constants';
import { Proyecto } from '../types';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.6 } }),
};

export default function HomePage() {
  const [featuredProjects, setFeaturedProjects] = useState<Proyecto[]>([]);
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      ProjectService.getFeatured().catch(() => []),
      GithubService.getRepos().catch(() => []),
    ]).then(([projects, githubRepos]) => {
      setFeaturedProjects(projects);
      setRepos(githubRepos.slice(0, 3));
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* HERO */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px 20px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,162,39,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} style={{ fontSize: '4rem', marginBottom: '20px' }}>
          &#9876;
        </motion.div>

        <motion.h1 className="lotr-title" custom={0} initial="hidden" animate="visible" variants={fadeUp} style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '8px' }}>
          Luis F.
        </motion.h1>

        <motion.p className="lotr-subtitle" custom={1} initial="hidden" animate="visible" variants={fadeUp} style={{ fontSize: 'clamp(0.8rem, 2vw, 1rem)', marginBottom: '16px' }}>
          Full Stack Developer Junior
        </motion.p>

        <motion.div className="lotr-divider" custom={2} initial="hidden" animate="visible" variants={fadeUp} />

        <motion.p className="lotr-text" custom={3} initial="hidden" animate="visible" variants={fadeUp} style={{ maxWidth: '600px', fontSize: '1rem', marginBottom: '30px' }}>
          Forjando aplicaciones modernas con las herramientas más poderosas del reino.
          Cada proyecto es una nueva aventura en el mundo del desarrollo.
        </motion.p>

        <motion.div custom={4} initial="hidden" animate="visible" variants={fadeUp} style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '24px' }}>
          <Link to="/proyectos" className="lotr-btn lotr-btn--primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            Ver Proyectos <ArrowRight size={16} />
          </Link>
          <a href="#" className="lotr-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }} download>
            Descargar CV <Download size={16} />
          </a>
        </motion.div>

        <motion.div custom={5} initial="hidden" animate="visible" variants={fadeUp} style={{ display: 'flex', gap: '16px' }}>
          <a href={SITE_CONFIG.github} target="_blank" rel="noopener noreferrer" className="icon-btn" style={{ color: 'var(--lotr-silver)' }}>
            <ExternalLink size={22} />
          </a>
          <a href={SITE_CONFIG.linkedin} target="_blank" rel="noopener noreferrer" className="icon-btn" style={{ color: 'var(--lotr-silver)' }}>
            <ExternalLink size={22} />
          </a>
        </motion.div>

        <div style={{ position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)', animation: 'ring-float 2s ease-in-out infinite', opacity: 0.5, fontSize: '1.5rem' }}>
          &#8964;
        </div>
      </section>

      {/* TECH STACK */}
      <section className="lotr-section">
        <motion.h2 className="lotr-title lotr-section-title" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          Las Armas del Developer
        </motion.h2>
        <div className="lotr-divider" />
        <p className="lotr-section-subtitle">Herramientas forjadas en los mejores talleres</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px', maxWidth: '800px', margin: '0 auto' }}>
          {['React', 'Ionic', 'TypeScript', 'Supabase', 'Node.js', 'Git', 'PostgreSQL', 'Tailwind'].map((tech, i) => (
            <motion.div key={tech} className="lotr-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} style={{ textAlign: 'center', padding: '20px' }}>
              <span style={{ fontSize: '1.5rem' }}>&#128295;</span>
              <p style={{ color: 'var(--lotr-gold)', fontFamily: "'Cinzel', serif", fontSize: '0.85rem', marginTop: '8px' }}>{tech}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      {featuredProjects.length > 0 && (
        <section className="lotr-section">
          <motion.h2 className="lotr-title lotr-section-title" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Proyectos Destacados
          </motion.h2>
          <div className="lotr-divider" />
          <p className="lotr-section-subtitle">Los scrolls más recientes de la comunidad</p>
          <div className="projects-grid">
            {featuredProjects.slice(0, 3).map((project, i) => (
              <motion.div key={project.id} className="lotr-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
                {project.imagen && <img src={project.imagen} alt={project.titulo} style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px', marginBottom: '12px' }} />}
                <h3 style={{ fontFamily: "'Cinzel', serif", color: 'var(--lotr-gold)', margin: '0 0 8px', fontSize: '1.1rem' }}>{project.titulo}</h3>
                <p style={{ color: '#a0a0b0', fontSize: '0.85rem', lineHeight: '1.5', marginBottom: '12px' }}>{project.descripcion}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                  {project.tecnologias?.slice(0, 4).map(t => (
                    <span key={t} className="tech-badge tech-badge--react" style={{ fontSize: '0.65rem', padding: '2px 8px' }}>{t}</span>
                  ))}
                </div>
                <span className={`status-badge status-badge--${project.estado}`}>{project.estado.replace('_', ' ')}</span>
              </motion.div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <Link to="/proyectos" className="lotr-btn" style={{ textDecoration: 'none' }}>
              Ver Todos los Proyectos &rarr;
            </Link>
          </div>
        </section>
      )}

      {/* GITHUB REPOS */}
      {!loading && repos.length > 0 && (
        <section className="lotr-section" style={{ paddingBottom: '40px' }}>
          <motion.h2 className="lotr-title lotr-section-title" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Repos Recientes
          </motion.h2>
          <div className="lotr-divider" />
          <div className="projects-grid">
            {repos.map((repo, i) => (
              <motion.div key={repo.id} className="lotr-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <h3 style={{ fontFamily: "'Cinzel', serif", color: 'var(--lotr-gold)', fontSize: '1rem', margin: '0 0 8px' }}>{repo.name}</h3>
                <p style={{ color: '#a0a0b0', fontSize: '0.85rem', flex: 1 }}>{repo.description || 'Sin descripción'}</p>
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="lotr-btn" style={{ fontSize: '0.75rem', padding: '8px 14px', flex: 1, textAlign: 'center', textDecoration: 'none' }}>
                    GitHub &rarr;
                  </a>
                  {repo.homepage && (
                    <a href={repo.homepage} target="_blank" rel="noopener noreferrer" className="lotr-btn lotr-btn--primary" style={{ fontSize: '0.75rem', padding: '8px 14px', flex: 1, textAlign: 'center', textDecoration: 'none' }}>
                      Demo
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
