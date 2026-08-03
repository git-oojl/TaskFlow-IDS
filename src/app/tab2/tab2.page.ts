import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonNote,
  IonSegment,
  IonSegmentButton,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToggle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { AlertController, ToastController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  calendarOutline,
  checkmarkCircleOutline,
  createOutline,
  flagOutline,
  layersOutline,
  timeOutline,
  trashOutline,
} from 'ionicons/icons';
import { AcademicTask, TaskPriority, TaskStatus } from '../models/task.model';
import { TaskService } from '../services/task.service';

type TaskFilter = 'Todas' | 'Hoy' | 'Esta semana' | 'Pendientes' | 'Completadas' | 'Atrasadas';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonChip,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonNote,
    IonSegment,
    IonSegmentButton,
    IonSelect,
    IonSelectOption,
    IonTitle,
    IonToggle,
    IonToolbar,
    RouterLink,
  ],
})
export class Tab2Page implements OnInit {
  tasks: AcademicTask[] = [];
  subjects: string[] = [];
  selectedFilter: TaskFilter = 'Todas';
  selectedSubject = 'Todas las materias';

  constructor(
    private readonly alertController: AlertController,
    public readonly taskService: TaskService,
    private readonly toastController: ToastController,
  ) {
    addIcons({
      calendarOutline,
      checkmarkCircleOutline,
      createOutline,
      flagOutline,
      layersOutline,
      timeOutline,
      trashOutline,
    });
  }

  async ngOnInit(): Promise<void> {
    await this.loadTasks();
  }

  async ionViewWillEnter(): Promise<void> {
    await this.loadTasks();
  }

  priorityColor(priority: TaskPriority): string {
    const colors: Record<TaskPriority, string> = {
      Baja: 'success',
      Media: 'warning',
      Alta: 'danger',
    };

    return colors[priority];
  }

  statusColor(status: TaskStatus): string {
    return status === 'completada' ? 'success' : 'medium';
  }

  filteredTasks(): AcademicTask[] {
    let result = [...this.tasks];

    if (this.selectedFilter === 'Hoy') {
      result = result.filter((task) => this.taskService.isDueToday(task));
    }

    if (this.selectedFilter === 'Esta semana') {
      result = result.filter((task) => this.taskService.isDueThisWeek(task));
    }

    if (this.selectedFilter === 'Pendientes') {
      result = result.filter((task) => task.status === 'pendiente');
    }

    if (this.selectedFilter === 'Completadas') {
      result = result.filter((task) => task.status === 'completada');
    }

    if (this.selectedFilter === 'Atrasadas') {
      result = result.filter((task) => this.taskService.isOverdue(task));
    }

    if (this.selectedSubject !== 'Todas las materias') {
      result = result.filter((task) => task.subject === this.selectedSubject);
    }

    return result;
  }

  changeFilter(value: string | number | undefined): void {
    if (
      value === 'Todas' ||
      value === 'Hoy' ||
      value === 'Esta semana' ||
      value === 'Pendientes' ||
      value === 'Completadas' ||
      value === 'Atrasadas'
    ) {
      this.selectedFilter = value;
    }
  }

  changeSubject(value: string | number | undefined): void {
    if (typeof value === 'string') {
      this.selectedSubject = value;
    }
  }

  async toggleTask(task: AcademicTask): Promise<void> {
    await this.taskService.toggleCompletion(task.id);
    this.tasks = this.taskService.getTasks();
  }

  async confirmDelete(task: AcademicTask): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Eliminar tarea',
      message: `¿Quieres eliminar la tarea "${task.title}"?`,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
        },
        {
          text: 'Sí, eliminar',
          role: 'destructive',
          handler: async () => {
            await this.taskService.deleteTask(task.id);
            await this.loadTasks();
            const toast = await this.toastController.create({
              message: 'Tarea eliminada.',
              duration: 1600,
              color: 'success',
            });
            await toast.present();
          },
        },
      ],
    });

    await alert.present();
  }

  formatDate(value: string): string {
    return new Intl.DateTimeFormat('es-MX', {
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(value));
  }

  private async loadTasks(): Promise<void> {
    await this.taskService.initialize();
    this.tasks = this.taskService.getTasks();
    this.subjects = this.taskService.getSubjects();

    if (this.selectedSubject !== 'Todas las materias' && !this.subjects.includes(this.selectedSubject)) {
      this.selectedSubject = 'Todas las materias';
    }
  }

}
