import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from './@static/footer/footer.component';
import { HeaderComponent } from './@static/header/header.component';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { NavComponent } from './@static/nav/nav.component';
import { CreateTicketComponent } from './create-ticket/create-ticket.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips'
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NotificationsComponent } from './notifications/notifications.component';
import {  MatTooltipModule } from '@angular/material/tooltip';
import { OkrComponent } from './okr/okr.component';
import {MatExpansionModule} from '@angular/material/expansion';


@NgModule({
  declarations: [
    PagesComponent,
    HeaderComponent,
    FooterComponent,
    NavComponent,
    CreateTicketComponent,
    NotificationsComponent,
    OkrComponent,
  ],
  imports: [
    PagesRoutingModule,
    CommonModule,
    FormsModule,
    HttpClientModule,

    MatIconModule,
    MatDialogModule,
    MatCardModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatFormFieldModule,
    MatOptionModule,
    MatMenuModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,

MatNativeDateModule,
MatExpansionModule

  ]
})

export class PagesModule {}
