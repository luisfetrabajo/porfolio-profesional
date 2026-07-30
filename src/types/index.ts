export interface Proyecto {
  id: string;
  titulo: string;
  descripcion: string;
  imagen: string | null;
  github: string | null;
  demo: string | null;
  tecnologias: string[];
  estado: 'en_desarrollo' | 'finalizado' | 'archivado';
  fecha: string;
  destacado: boolean;
  created_at: string;
}

export interface Habilidad {
  id: string;
  nombre: string;
  icono: string;
  categoria: 'frontend' | 'backend' | 'herramientas';
}

export interface Experiencia {
  id: string;
  empresa: string;
  cargo: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin: string | null;
}

export interface Certificado {
  id: string;
  titulo: string;
  institucion: string;
  url: string | null;
  imagen: string | null;
}

export interface Mensaje {
  _id : string;
  nombre: string;
  email: string;
  asunto: string;
  mensaje: string;
  leido: boolean;
  created_at: string;
}

export type UserRole = 'admin' | 'authorized' | 'guest';

export interface UserProfile {
  id: number;
  email: string;
  role: UserRole;
  full_name: string | null;
  created_at: string;
}

export interface Stats {
  proyectos: number;
  mensajes: number;
  mensajesNoLeidos: number;
  habilidades: number;
}

export type ProjectStatus = Proyecto['estado'];

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  en_desarrollo: 'En Desarrollo',
  finalizado: 'Finalizado',
  archivado: 'Archivado',
};

export const PROJECT_STATUS_COLORS: Record<ProjectStatus, string> = {
  en_desarrollo: '#f59e0b',
  finalizado: '#10b981',
  archivado: '#6b7280',
};
