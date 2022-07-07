import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AllTaskRoutingModule } from './all-task-routing.module';
import { AllTaskComponent } from './all-task.component';
import { AppTaskComponent } from './app-task/app-task.component';
import { AlltaskSummaryComponentComponent } from './alltask-summary-component/alltask-summary-component.component';



@NgModule({
  declarations: [
    AllTaskComponent,
    AppTaskComponent,
    AlltaskSummaryComponentComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AllTaskRoutingModule,

  ]
})
export class AllTaskModule { }
