import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { AllTaskComponent } from './all-task.component';

const routes: Routes = [
  {
    path: '',
    component: AllTaskComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllTaskRoutingModule { }
