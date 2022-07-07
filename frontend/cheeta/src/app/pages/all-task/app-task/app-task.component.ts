import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateTicketComponent } from '../../create-ticket/create-ticket.component';
import { ViewComponent } from '../../kanban/tickets/view/view.component';

@Component({
  selector: 'app-task',
  templateUrl: './app-task.component.html',
  styleUrls: ['./app-task.component.scss']
})
export class AppTaskComponent implements OnInit {

  @Input() taskSummary: any = {};
  edit = true;
  
  constructor(
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }
  openTicketDetails(){
    this.dialog.open(CreateTicketComponent, {data: {ticketInfo: this.taskSummary , edit:this.edit}})
    // this.dialog.open(ViewComponent, {data: {ticketInfo: this.taskSummary}})
  }

}
