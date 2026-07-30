export type TaskPriority = 'Baja' | 'Media' | 'Alta';
export type TaskStatus = 'pendiente' | 'completada';

export interface AcademicTask {
  id: string;
  title: string;
  description?: string;
  subject: string;
  dueAt: string;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: string;
}
