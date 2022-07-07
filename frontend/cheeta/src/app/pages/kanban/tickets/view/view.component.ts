import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { CreateTicketComponent } from 'src/app/pages/create-ticket/create-ticket.component';
import { CheetaTicketService } from 'src/app/service/cheetaTicket.service';
import { DeleteComponent } from '../delete/delete.component';
import { LogsComponent } from './logs/logs.component';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit, OnDestroy {

  takeSub: Subscription;

  ticketInfo: any = {};
  edit = true;

  show = false;

  comments: any[]= [];


  constructor(
    public cheetaTicketService: CheetaTicketService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.ticketInfo = this.data.ticketInfo;
    this.comments = this.data.ticketInfo.comments

    this.takeSub = this.cheetaTicketService.getTicketUpdateListener()
    .subscribe(async (data: any) => {
      // this.dialogRef.close();
    })
  }

  openEdit(){
    this.dialog.open(CreateTicketComponent, {data: {ticketInfo: this.ticketInfo , edit:this.edit}})
  }

  async openDelete(){
     await this.dialog.open(DeleteComponent, {data: {ticketInfo: this.ticketInfo}})
     this.dialogRef.close();
  }

  showLogs(){
    this.show = true;
  }
  hideLogs(){
    this.show =false;
  }

  async addComment(comment: any) {
    let commentObj = {
      user: localStorage.getItem('email'),
      msg: comment.value,
      dateTime: new Date().toISOString()
    }
    this.comments.push(commentObj)
    this.cheetaTicketService.updateTicket(this.data.ticketInfo._id, {comments: this.comments});
  }

  goToLink(url: string){
    window.open(url, "_blank");
  }


  ngOnDestroy(): void {
    this.takeSub.unsubscribe();
  }

}
