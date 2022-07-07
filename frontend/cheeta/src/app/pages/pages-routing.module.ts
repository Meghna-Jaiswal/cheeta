import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';


const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: '',
      loadChildren: () => import('./home/home.module')
        .then(m => m.HomeModule),
    },
    {
      path: 'kanban',
      loadChildren: () => import('./kanban/kanban.module')
        .then(m => m.KanbanModule),
    },
    {
      path: 'allTask',
      loadChildren: () => import('./all-task/all-task.module')
        .then(m => m.AllTaskModule),
    },
    {
      path: 'okr',
      loadChildren: () => import('./okr/okr.module')
        .then(m => m.OkrModule),
    },
    {
      path: 'userProfile',
      loadChildren: () => import('./user-profile/user-profile.module')
        .then(m => m.UserProfileModule),
    },
    {
      path: '',
      redirectTo: 'home',
      pathMatch: 'full',
    },
  ],
}];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})


export class PagesRoutingModule { }
