import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { AcademicTask } from '../models/task.model';

const TASKS_KEY = 'taskflow.tasks';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasks: AcademicTask[] = [];
  private ready = false;

  async initialize(): Promise<void> {
    if (this.ready) {
      return;
    }

    await this.loadTasks();
    this.ready = true;
  }

  async loadTasks(): Promise<AcademicTask[]> {
    const result = await Preferences.get({ key: TASKS_KEY });

    if (!result.value) {
      this.tasks = this.createDemoTasks();
      await this.saveTasks();
      return this.getTasks();
    }

    try {
      this.tasks = JSON.parse(result.value) as AcademicTask[];
    } catch {
      this.tasks = [];
    }

    return this.getTasks();
  }

  async saveTasks(): Promise<void> {
    await Preferences.set({
      key: TASKS_KEY,
      value: JSON.stringify(this.tasks),
    });
  }

  async addTask(task: AcademicTask): Promise<void> {
    this.tasks = [...this.tasks, task];
    await this.saveTasks();
  }

  async toggleCompletion(id: string): Promise<void> {
    this.tasks = this.tasks.map((task) =>
      task.id === id
        ? { ...task, status: task.status === 'pendiente' ? 'completada' : 'pendiente' }
        : task,
    );
    await this.saveTasks();
  }

  getTasks(): AcademicTask[] {
    return [...this.tasks].sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime());
  }

  isOverdue(task: AcademicTask): boolean {
    return task.status === 'pendiente' && new Date(task.dueAt).getTime() < Date.now();
  }

  isDueToday(task: AcademicTask): boolean {
    const due = new Date(task.dueAt);
    const today = new Date();

    return (
      due.getFullYear() === today.getFullYear() &&
      due.getMonth() === today.getMonth() &&
      due.getDate() === today.getDate()
    );
  }

  isDueThisWeek(task: AcademicTask): boolean {
    const due = new Date(task.dueAt);
    const { start, end } = this.getCurrentWeekRange();

    return due.getTime() >= start.getTime() && due.getTime() <= end.getTime();
  }

  getNextPendingTask(): AcademicTask | undefined {
    return this.getTasks().find((task) => task.status === 'pendiente');
  }

  getCompletionPercentage(): number {
    if (this.tasks.length === 0) {
      return 0;
    }

    return Math.round((this.getCompletedCount() / this.tasks.length) * 100);
  }

  getPendingCount(): number {
    return this.tasks.filter((task) => task.status === 'pendiente').length;
  }

  getCompletedCount(): number {
    return this.tasks.filter((task) => task.status === 'completada').length;
  }

  getOverdueCount(): number {
    return this.tasks.filter((task) => this.isOverdue(task)).length;
  }

  // La semana actual se define de lunes 00:00 a domingo 23:59:59.
  private getCurrentWeekRange(): { start: Date; end: Date } {
    const now = new Date();
    const start = new Date(now);
    const day = start.getDay();
    const distanceFromMonday = day === 0 ? -6 : 1 - day;

    start.setDate(start.getDate() + distanceFromMonday);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);

    return { start, end };
  }

  private createDemoTasks(): AcademicTask[] {
    const now = new Date();
    const createdAt = this.toLocalIsoString(now);

    return [
      {
        id: crypto.randomUUID(),
        title: 'Entregar resumen de historia',
        description: 'Revisar conclusiones y ortografía antes de subirlo.',
        subject: 'Historia',
        dueAt: this.relativeDate(0, 18, 0),
        priority: 'Alta',
        status: 'pendiente',
        createdAt,
      },
      {
        id: crypto.randomUUID(),
        title: 'Resolver guía de álgebra',
        subject: 'Matemáticas',
        dueAt: this.relativeDate(2, 20, 0),
        priority: 'Media',
        status: 'pendiente',
        createdAt,
      },
      {
        id: crypto.randomUUID(),
        title: 'Leer capítulo de biología',
        subject: 'Biología',
        dueAt: this.relativeDate(4, 17, 30),
        priority: 'Baja',
        status: 'pendiente',
        createdAt,
      },
      {
        id: crypto.randomUUID(),
        title: 'Subir práctica de laboratorio',
        subject: 'Química',
        dueAt: this.relativeDate(-1, 14, 0),
        priority: 'Alta',
        status: 'pendiente',
        createdAt,
      },
      {
        id: crypto.randomUUID(),
        title: 'Foro de lectura completado',
        subject: 'Literatura',
        dueAt: this.relativeDate(-2, 19, 0),
        priority: 'Media',
        status: 'completada',
        createdAt,
      },
    ];
  }

  private relativeDate(days: number, hour: number, minute: number): string {
    const date = new Date();
    date.setDate(date.getDate() + days);
    date.setHours(hour, minute, 0, 0);

    return this.toLocalIsoString(date);
  }

  private toLocalIsoString(date: Date): string {
    const pad = (value: number) => value.toString().padStart(2, '0');

    return [
      date.getFullYear(),
      pad(date.getMonth() + 1),
      pad(date.getDate()),
    ].join('-') + `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }
}
