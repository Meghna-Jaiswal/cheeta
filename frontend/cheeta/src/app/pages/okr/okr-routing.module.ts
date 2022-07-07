import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { OkrComponent } from './okr.component';

const routes: Routes = [
  {
    path: '',
    component: OkrComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OkrRoutingModule { }
