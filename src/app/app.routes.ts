import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'editar-tarea/:id',
    loadComponent: () =>
      import('./edit-task/edit-task.page').then((m) => m.EditTaskPage),
  },
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
];
