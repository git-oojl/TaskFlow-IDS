import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  IonToolbar,
} from '@ionic/angular/standalone';
import { AcademicTask, TaskPriority } from '../models/task.model';
import { TaskService } from '../services/task.service';

interface EditTaskFormModel {
  title: string;
  description: string;
  subject: string;
  dueAt: string;
  priority: TaskPriority | '';
}

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.page.html',
  styleUrls: ['./edit-task.page.scss'],
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
    IonToolbar,
  ],
})
export class EditTaskPage implements OnInit {
  readonly priorities: TaskPriority[] = ['Baja', 'Media', 'Alta'];
  draft: EditTaskFormModel = this.createEmptyDraft();
  submitted = false;
  task?: AcademicTask;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly taskService: TaskService,
  ) {}

  async ngOnInit(): Promise<void> {
    await this.taskService.initialize();
    const id = this.route.snapshot.paramMap.get('id');
    this.task = id ? this.taskService.getTaskById(id) : undefined;

    if (!this.task) {
      await this.router.navigateByUrl('/tabs/tareas');
      return;
    }

    this.draft = {
      title: this.task.title,
      description: this.task.description ?? '',
      subject: this.task.subject,
      dueAt: this.task.dueAt,
      priority: this.task.priority,
    };
  }

  get isFormValid(): boolean {
    return Boolean(
      this.draft.title.trim() &&
        this.draft.subject.trim() &&
        this.draft.priority &&
        this.isValidDate(this.draft.dueAt),
    );
  }

  async saveChanges(): Promise<void> {
    this.submitted = true;

    if (!this.task || !this.isFormValid) {
      return;
    }

    await this.taskService.updateTask({
      ...this.task,
      title: this.draft.title.trim(),
      description: this.draft.description.trim() || undefined,
      subject: this.draft.subject.trim(),
      dueAt: this.draft.dueAt,
      priority: this.draft.priority as TaskPriority,
    });

    await this.router.navigateByUrl('/tabs/tareas');
  }

  private createEmptyDraft(): EditTaskFormModel {
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
}
