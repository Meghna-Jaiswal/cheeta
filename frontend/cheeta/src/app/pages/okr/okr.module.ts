import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OkrRoutingModule } from './okr-routing.module';
import { OkrFormComponent } from './okr-form/okr-form.component';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { DeleteComponent } from './delete/delete.component';



@NgModule({
  declarations: [
    OkrFormComponent,
    DeleteComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    OkrRoutingModule,
    
    MatIconModule,
    MatChipsModule
  ]
})
export class OkrModule { }
