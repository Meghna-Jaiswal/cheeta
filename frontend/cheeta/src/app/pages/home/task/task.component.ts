import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateTicketComponent } from '../../create-ticket/create-ticket.component';
import { ViewComponent } from '../../kanban/tickets/view/view.component';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {

  @Input() taskSummary: any = {};
  edit = true;

  constructor(
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    console.log(this.taskSummary);
  }
  openTicketDetails(){
    this.dialog.open(CreateTicketComponent, {data: {ticketInfo: this.taskSummary , edit:this.edit}})
    // this.dialog.open(ViewComponent, {data: {ticketInfo: this.taskSummary}})
  }
  onCheck(){
    console.log(this.taskSummary.state)
    if(this.taskSummary.state=='development')
    {
      this.taskSummary.state === 'testing';
    }
  }

}
