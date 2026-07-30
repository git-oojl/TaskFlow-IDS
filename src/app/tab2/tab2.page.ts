import { Component, OnInit } from '@angular/core';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonNote,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToggle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { calendarOutline, checkmarkCircleOutline, flagOutline, layersOutline, timeOutline } from 'ionicons/icons';
import { AcademicTask, TaskPriority, TaskStatus } from '../models/task.model';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonChip,
    IonContent,
    IonHeader,
    IonIcon,
    IonLabel,
    IonNote,
    IonSegment,
    IonSegmentButton,
    IonTitle,
    IonToggle,
    IonToolbar,
  ],
})
export class Tab2Page implements OnInit {
  tasks: AcademicTask[] = [];
  selectedFilter: 'Todas' | 'Hoy' | 'Esta semana' = 'Todas';

  constructor(public readonly taskService: TaskService) {
    addIcons({ calendarOutline, checkmarkCircleOutline, flagOutline, layersOutline, timeOutline });
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
    if (this.selectedFilter === 'Hoy') {
      return this.tasks.filter((task) => this.taskService.isDueToday(task));
    }

    if (this.selectedFilter === 'Esta semana') {
      return this.tasks.filter((task) => this.taskService.isDueThisWeek(task));
    }

    return this.tasks;
  }

  changeFilter(value: string | number | undefined): void {
    if (value === 'Todas' || value === 'Hoy' || value === 'Esta semana') {
      this.selectedFilter = value;
    }
  }

  async toggleTask(task: AcademicTask): Promise<void> {
    await this.taskService.toggleCompletion(task.id);
    this.tasks = this.taskService.getTasks();
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
  }

}
