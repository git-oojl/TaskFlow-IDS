import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonDatetime,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonText,
  IonTextarea,
  IonTitle,
  IonToast,
  IonToolbar,
} from '@ionic/angular/standalone';
import { AcademicTask, TaskPriority } from '../models/task.model';
import { TaskService } from '../services/task.service';

interface TaskFormModel {
  title: string;
  description: string;
  subject: string;
  dueAt: string;
  priority: TaskPriority | '';
}

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [
    FormsModule,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonContent,
    IonDatetime,
    IonHeader,
    IonInput,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonText,
    IonTextarea,
    IonTitle,
    IonToast,
    IonToolbar,
  ],
})
export class Tab3Page {
  readonly priorities: TaskPriority[] = ['Baja', 'Media', 'Alta'];
  draft: TaskFormModel = this.createEmptyDraft();
  submitted = false;
  showSuccessToast = false;

  constructor(
    private readonly router: Router,
    private readonly taskService: TaskService,
  ) {}

  get isFormValid(): boolean {
    return Boolean(
      this.draft.title.trim() &&
        this.draft.subject.trim() &&
        this.draft.priority &&
        this.isValidDate(this.draft.dueAt),
    );
  }

  async saveTask(): Promise<void> {
    this.submitted = true;

    if (!this.isFormValid) {
      return;
    }

    await this.taskService.initialize();

    const task: AcademicTask = {
      id: crypto.randomUUID(),
      title: this.draft.title.trim(),
      description: this.draft.description.trim() || undefined,
      subject: this.draft.subject.trim(),
      dueAt: this.draft.dueAt,
      priority: this.draft.priority as TaskPriority,
      status: 'pendiente',
      createdAt: this.toLocalIsoString(new Date()),
    };

    await this.taskService.addTask(task);
    this.draft = this.createEmptyDraft();
    this.submitted = false;
    this.showSuccessToast = true;
    await this.router.navigateByUrl('/tabs/tareas');
  }

  resetToast(): void {
    this.showSuccessToast = false;
  }

  private createEmptyDraft(): TaskFormModel {
    return {
      title: '',
      description: '',
      subject: '',
      dueAt: '',
      priority: '',
    };
  }

  private isValidDate(value: string): boolean {
    return Boolean(value && !Number.isNaN(new Date(value).getTime()));
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
