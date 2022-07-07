import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KanbanComponent } from './kanban.component';
import { KanbanRoutingModule } from './kanban-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TicketsComponent } from './tickets/tickets.component';
import { ViewComponent } from './tickets/view/view.component';
import { DeleteComponent } from './tickets/delete/delete.component';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { LogsComponent } from './tickets/view/logs/logs.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';

@NgModule({
  declarations: [
    KanbanComponent,
    TicketsComponent,
    ViewComponent,
    DeleteComponent,
    LogsComponent,
  ],
  imports: [
    CommonModule,
    KanbanRoutingModule,
    FormsModule,

    MatIconModule,
    MatMenuModule,
    MatSelectModule,
    MatChipsModule,

    DragDropModule,
    MatProgressSpinnerModule,
    MatBottomSheetModule,
    MatTooltipModule
  ],
})
export class KanbanModule { }
