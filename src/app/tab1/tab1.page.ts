import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonProgressBar,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { alertCircleOutline, checkmarkCircleOutline, listOutline, schoolOutline, timeOutline } from 'ionicons/icons';
import { AcademicTask } from '../models/task.model';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [
    IonBadge,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonContent,
    IonHeader,
    IonIcon,
    IonProgressBar,
    IonTitle,
    IonToolbar,
    RouterLink,
  ],
})
export class Tab1Page implements OnInit {
  pendingCount = 0;
  completedCount = 0;
  overdueCount = 0;
  completionPercentage = 0;
  nextTask?: AcademicTask;

  constructor(public readonly taskService: TaskService) {
    addIcons({ alertCircleOutline, checkmarkCircleOutline, listOutline, schoolOutline, timeOutline });
  }

  async ngOnInit(): Promise<void> {
    await this.refreshDashboard();
  }

  async ionViewWillEnter(): Promise<void> {
    await this.refreshDashboard();
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

  private async refreshDashboard(): Promise<void> {
    await this.taskService.initialize();
    this.pendingCount = this.taskService.getPendingCount();
    this.completedCount = this.taskService.getCompletedCount();
    this.overdueCount = this.taskService.getOverdueCount();
    this.completionPercentage = this.taskService.getCompletionPercentage();
    this.nextTask = this.taskService.getNextPendingTask();
  }
}
