import { Component, Input, OnDestroy, OnInit, Optional } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { CheetaTicketService } from 'src/app/service/cheetaTicket.service';
import { CreateTicketComponent } from '../../create-ticket/create-ticket.component';
import { DeleteComponent } from './delete/delete.component';
import { ViewComponent } from './view/view.component';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss']
})
export class TicketsComponent implements OnInit {

  @Input() ticketInfo: any = {};

  edit = true;

  constructor(
    @Optional() public dialogRef: MatDialogRef<TicketsComponent>,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }
  openTicketDetails(){
    this.dialog.open(CreateTicketComponent, {data: {ticketInfo: this.ticketInfo , edit:this.edit}})
    // this.dialog.open(ViewComponent, {data: {ticketInfo: this.ticketInfo}})
    // console.log(this.ticketInfo)


  }
  onRightClick(event: any) {
    event.preventDefault()
    this.dialog.open(DeleteComponent)

  }

}
