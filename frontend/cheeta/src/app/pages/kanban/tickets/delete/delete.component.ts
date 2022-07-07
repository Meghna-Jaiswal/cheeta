import { Component, Inject, Input, OnInit, Optional } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationsComponent } from 'src/app/pages/notifications/notifications.component';
import { WarningDialog } from 'src/app/pages/notifications/warning.component';
import { CheetaTicketService } from 'src/app/service/cheetaTicket.service';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss']
})
export class DeleteComponent implements OnInit {

  @Input() ticketInfo: any = {};

  constructor(
    @Optional() public dialogRef: MatDialogRef<DeleteComponent>,
    public cheetaTicketService: CheetaTicketService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,

  ) { }

  ngOnInit(): void {
    this.ticketInfo = this.data.ticketInfo;
  }
  onCancel(){
    this.dialogRef.close();
  }
  async onDelete(){
    try{
     await this.cheetaTicketService.deleteTicket(this.ticketInfo._id);
     this.openDialog('Deleted Successfully');
     this.dialogRef.close();
    }
    catch(err){
      this.openWarningDialog("Something went wrong");
    }


  }

  openDialog(warning: string): void {
    const dialogRef = this.dialog.open(NotificationsComponent, {
      data: warning,
    });
  }

  openWarningDialog(warning: string): void{
    const dialogRef = this.dialog.open(WarningDialog, {
      data: warning,
    });
  }

}
