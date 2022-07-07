import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { TaskComponent } from './task/task.component';
import { SummaryComponent } from './summary/summary.component';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  declarations: [
    HomeComponent,
    TaskComponent,
    SummaryComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    HomeRoutingModule,

    MatIconModule,
    MatDialogModule,
    MatCardModule,
    MatMenuModule,
    MatCheckboxModule,
  ]
})
export class HomeModule { }
