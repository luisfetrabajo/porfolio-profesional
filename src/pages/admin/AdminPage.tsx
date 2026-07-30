import { useEffect, useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  BarChart3,
  MessageSquare,
  Briefcase,
  Wrench,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { ProjectService } from "../../services/ProjectService";
import { SkillService } from "../../services/SkillService";
import { MessageService } from "../../services/MessageService";
import { StorageService } from "../../services/StorageService";
import {
  Proyecto,
  Habilidad,
  Mensaje,
  Stats,
  PROJECT_STATUS_LABELS,
} from "../../types";

type Tab = "dashboard" | "projects" | "skills" | "messages";

export default function AdminPage() {
  const { isAdmin, user } = useAuth();
  const [tab, setTab] = useState<Tab>("dashboard");
  const [stats, setStats] = useState<Stats>({
    proyectos: 0,
    mensajes: 0,
    mensajesNoLeidos: 0,
    habilidades: 0,
  });
  const [projects, setProjects] = useState<Proyecto[]>([]);
  const [skills, setSkills] = useState<Habilidad[]>([]);
  const [messages, setMessages] = useState<Mensaje[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);

  useEffect(() => {
    if (!isAdmin) return;
    loadData();
  }, [isAdmin]);

  const loadData = async () => {
    const m = await MessageService.getAll();

    console.log(m);
    setLoading(true);
    try {
      const [p, s, m] = await Promise.all([
        ProjectService.getAll(),
        SkillService.getAll(),
        MessageService.getAll(),
      ]);
      console.log("PRIMER MENSAJE:", m[0]);
      setProjects(p);
      setSkills(s);
      setMessages(m);
      setStats({
        proyectos: p.length,
        mensajes: m.length,
        mensajesNoLeidos: m.filter((msg) => !msg.leido).length,
        habilidades: s.length,
      });
    } catch {
      /* silently fail */
    }
    setLoading(false);
  };

  if (!isAdmin) {
    return (
      <section
        className="lotr-section"
        style={{ paddingTop: "100px", minHeight: "100vh", textAlign: "center" }}
      >
        <h2 className="lotr-title" style={{ fontSize: "1.8rem" }}>
          Acceso Denegado
        </h2>
        <p className="lotr-text" style={{ marginTop: "16px" }}>
          No tienes permisos para acceder a esta sección.
        </p>
      </section>
    );
  }

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "dashboard", label: "Dashboard", icon: <BarChart3 size={16} /> },
    { key: "projects", label: "Proyectos", icon: <Briefcase size={16} /> },
    { key: "skills", label: "Habilidades", icon: <Wrench size={16} /> },
    { key: "messages", label: "Mensajes", icon: <MessageSquare size={16} /> },
  ];

  return (
    <div className="admin-layout" style={{ paddingTop: "80px" }}>
      <div className="admin-header">
        <h1 className="admin-title">Panel de Control</h1>
        <span className="lotr-subtitle" style={{ fontSize: "0.8rem" }}>
          Bienvenido, {user?.email}
        </span>
      </div>

      {/* TAB NAV */}
      <div className="filter-pills" style={{ marginBottom: "30px" }}>
        {tabs.map((t) => (
          <button
            key={t.key}
            className={`filter-pill ${tab === t.key ? "filter-pill--active" : ""}`}
            onClick={() => setTab(t.key)}
            style={{ display: "flex", alignItems: "center", gap: "6px" }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* DASHBOARD TAB */}
      {tab === "dashboard" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-number">{stats.proyectos}</span>
              <span className="stat-label">Proyectos</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{stats.mensajes}</span>
              <span className="stat-label">Mensajes</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{stats.mensajesNoLeidos}</span>
              <span className="stat-label">Sin Leer</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{stats.habilidades}</span>
              <span className="stat-label">Habilidades</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* PROJECTS TAB */}
      {tab === "projects" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="admin-section-header">
            <h3 className="admin-section-title">Gestión de Proyectos</h3>
            <button
              className="lotr-btn lotr-btn--primary"
              onClick={() => {
                setEditingItem(null);
                setShowModal("project");
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "0.8rem",
                padding: "8px 16px",
              }}
            >
              <Plus size={14} /> Nuevo Proyecto
            </button>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => (
                  <tr key={p.id}>
                    <td
                      style={{
                        fontFamily: "'Cinzel', serif",
                        color: "var(--lotr-gold)",
                      }}
                    >
                      {p.titulo}
                    </td>
                    <td>
                      <span
                        className={`status-badge status-badge--${p.estado}`}
                      >
                        {PROJECT_STATUS_LABELS[p.estado]}
                      </span>
                    </td>
                    <td>{new Date(p.fecha).toLocaleDateString("es-ES")}</td>
                    <td>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          className="icon-btn"
                          onClick={() => {
                            setEditingItem(p);
                            setShowModal("project");
                          }}
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          className="icon-btn"
                          onClick={async () => {
                            if (confirm("¿Eliminar proyecto?")) {
                              await ProjectService.delete(p.id);
                              loadData();
                            }
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                        <button
                          className="icon-btn"
                          onClick={async () => {
                            await ProjectService.toggleFeatured(
                              p.id,
                              !p.destacado,
                            );
                            loadData();
                          }}
                        >
                          {p.destacado ? (
                            <Eye size={14} color="var(--lotr-gold)" />
                          ) : (
                            <EyeOff size={14} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* SKILLS TAB */}
      {tab === "skills" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="admin-section-header">
            <h3 className="admin-section-title">Gestión de Habilidades</h3>
            <button
              className="lotr-btn lotr-btn--primary"
              onClick={() => {
                setEditingItem(null);
                setShowModal("skill");
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "0.8rem",
                padding: "8px 16px",
              }}
            >
              <Plus size={14} /> Nueva Habilidad
            </button>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {skills.map((s) => (
                  <tr key={s.id}>
                    <td
                      style={{
                        fontFamily: "'Cinzel', serif",
                        color: "var(--lotr-gold)",
                      }}
                    >
                      {s.nombre}
                    </td>
                    <td style={{ textTransform: "capitalize" }}>
                      {s.categoria}
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          className="icon-btn"
                          onClick={() => {
                            setEditingItem(s);
                            setShowModal("skill");
                          }}
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          className="icon-btn"
                          onClick={async () => {
                            if (confirm("¿Eliminar habilidad?")) {
                              await SkillService.delete(s.id);
                              loadData();
                            }
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* MESSAGES TAB */}
      {tab === "messages" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="admin-section-header">
            <h3 className="admin-section-title">Mensajes Recibidos</h3>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Asunto</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((m) => (
                  <tr key={m._id} style={{ opacity: m.leido ? 0.6 : 1 }}>
                    <td>{m.nombre}</td>
                    <td>{m.email}</td>
                    <td>{m.asunto}</td>
                    <td>
                      <span
                        className={`status-badge ${m.leido ? "status-badge--archivado" : "status-badge--en_desarrollo"}`}
                      >
                        {m.leido ? "Leído" : "Nuevo"}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          className="icon-btn"
                          onClick={() => {
                            setEditingItem(m);
                            setShowModal("message");
                          }}
                        >
                          {m.leido ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                        <button
                          className="icon-btn"
                          onClick={async () => {
                            if (confirm("¿Eliminar mensaje?")) {
                              await MessageService.delete(m._id);
                              loadData();
                            }
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* MODALS */}
      <AnimatePresence>
        {showModal === "project" && (
          <ProjectModal
            item={editingItem}
            onClose={() => setShowModal(null)}
            onSaved={() => {
              setShowModal(null);
              loadData();
            }}
          />
        )}
        {showModal === "skill" && (
          <SkillModal
            item={editingItem}
            onClose={() => setShowModal(null)}
            onSaved={() => {
              setShowModal(null);
              loadData();
            }}
          />
        )}
        {showModal === "message" && editingItem && (
          <MessageModal
            item={editingItem}
            onClose={() => setShowModal(null)}
            onRead={async () => {
              await MessageService.markAsRead(editingItem._id);
              loadData();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ===== PROJECT MODAL ===== */
function ProjectModal({
  item,
  onClose,
  onSaved,
}: {
  item: Proyecto | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    titulo: item?.titulo || "",
    descripcion: item?.descripcion || "",
    github: item?.github || "",
    demo: item?.demo || "",
    tecnologias: item?.tecnologias?.join(", ") || "",
    estado: item?.estado || "en_desarrollo",
    fecha: item?.fecha || new Date().toISOString().split("T")[0],
    destacado: item?.destacado || false,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let imageUrl = item?.imagen || null;
      if (imageFile) {
        imageUrl = await StorageService.uploadImage(imageFile);
      }
      const data = {
        ...form,
        imagen: imageUrl,
        tecnologias: form.tecnologias
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };
      if (item) {
        await ProjectService.update(item.id, data);
      } else {
        await ProjectService.create(data as any);
      }
      onSaved();
    } catch {
      alert("Error al guardar");
    }
    setSaving(false);
  };

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="modal-content"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h3 className="modal-title">
            {item ? "Editar Proyecto" : "Nuevo Proyecto"}
          </h3>
          <button className="icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Título</label>
            <input
              className="form-input"
              required
              value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Descripción</label>
            <textarea
              className="form-textarea"
              required
              value={form.descripcion}
              onChange={(e) =>
                setForm({ ...form, descripcion: e.target.value })
              }
            />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <div className="form-group">
              <label className="form-label">GitHub URL</label>
              <input
                className="form-input"
                value={form.github}
                onChange={(e) => setForm({ ...form, github: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Demo URL</label>
              <input
                className="form-input"
                value={form.demo}
                onChange={(e) => setForm({ ...form, demo: e.target.value })}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">
              Tecnologías (separadas por coma)
            </label>
            <input
              className="form-input"
              value={form.tecnologias}
              onChange={(e) =>
                setForm({ ...form, tecnologias: e.target.value })
              }
              placeholder="React, Ionic, TypeScript"
            />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <div className="form-group">
              <label className="form-label">Estado</label>
              <select
                className="form-select"
                value={form.estado}
                onChange={(e) =>
                  setForm({ ...form, estado: e.target.value as any })
                }
              >
                <option value="en_desarrollo">En Desarrollo</option>
                <option value="finalizado">Finalizado</option>
                <option value="archivado">Archivado</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Fecha</label>
              <input
                type="date"
                className="form-input"
                value={form.fecha}
                onChange={(e) => setForm({ ...form, fecha: e.target.value })}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Imagen</label>
            <input
              type="file"
              accept="image/*"
              className="form-input"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            />
          </div>
          <div
            className="form-group"
            style={{ display: "flex", alignItems: "center", gap: "10px" }}
          >
            <input
              type="checkbox"
              id="destacado"
              checked={form.destacado}
              onChange={(e) =>
                setForm({ ...form, destacado: e.target.checked })
              }
              style={{ accentColor: "var(--lotr-gold)" }}
            />
            <label
              htmlFor="destacado"
              className="form-label"
              style={{ margin: 0 }}
            >
              Destacado
            </label>
          </div>
          <button
            type="submit"
            className="lotr-btn lotr-btn--primary"
            disabled={saving}
            style={{ width: "100%", marginTop: "8px" }}
          >
            {saving ? "Guardando..." : "Guardar Proyecto"}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

/* ===== SKILL MODAL ===== */
function SkillModal({
  item,
  onClose,
  onSaved,
}: {
  item: Habilidad | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    nombre: item?.nombre || "",
    icono: item?.icono || "",
    categoria: item?.categoria || "frontend",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (item) {
        await SkillService.update(item.id, form);
      } else {
        await SkillService.create(form);
      }
      onSaved();
    } catch {
      alert("Error al guardar");
    }
    setSaving(false);
  };

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="modal-content"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h3 className="modal-title">
            {item ? "Editar Habilidad" : "Nueva Habilidad"}
          </h3>
          <button className="icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nombre</label>
            <input
              className="form-input"
              required
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Icono (emoji o nombre)</label>
            <input
              className="form-input"
              value={form.icono}
              onChange={(e) => setForm({ ...form, icono: e.target.value })}
              placeholder="⚛️"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Categoría</label>
            <select
              className="form-select"
              value={form.categoria}
              onChange={(e) =>
                setForm({ ...form, categoria: e.target.value as any })
              }
            >
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="herramientas">Herramientas</option>
            </select>
          </div>
          <button
            type="submit"
            className="lotr-btn lotr-btn--primary"
            disabled={saving}
            style={{ width: "100%" }}
          >
            {saving ? "Guardando..." : "Guardar Habilidad"}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

/* ===== MESSAGE MODAL ===== */
function MessageModal({
  item,
  onClose,
  onRead,
}: {
  item: Mensaje;
  onClose: () => void;
  onRead: () => void;
}) {
  useEffect(() => {
    if (!item.leido) onRead();
  }, []);

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="modal-content"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h3 className="modal-title">{item.asunto}</h3>
          <button className="icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div style={{ marginBottom: "16px" }}>
          <p
            style={{
              color: "var(--lotr-gold)",
              fontSize: "0.85rem",
              margin: "0 0 4px",
            }}
          >
            {item.nombre}
          </p>
          <p style={{ color: "#666", fontSize: "0.8rem", margin: 0 }}>
            {item.email}
          </p>
          <p style={{ color: "#555", fontSize: "0.75rem", margin: "8px 0 0" }}>
            {new Date(item.created_at).toLocaleString("es-ES")}
          </p>
        </div>
        <div
          style={{
            borderTop: "1px solid rgba(201, 162, 39, 0.1)",
            paddingTop: "16px",
          }}
        >
          <p
            className="lotr-text"
            style={{ whiteSpace: "pre-wrap", lineHeight: 1.7 }}
          >
            {item.mensaje}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
