import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { CheetaOkrService } from 'src/app/service/cheetaOkr.service';
import { NotificationsService } from 'src/app/service/notification/notifications.service';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss']
})
export class DeleteComponent implements OnInit {

  @Input() okrInfo: any = {};

  // takeSub: Subscription;

  constructor(
    public cheetaOkrService: CheetaOkrService,
    public dialogRef: MatDialogRef<DeleteComponent>,
    public notification: NotificationsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.okrInfo = this.data.ticketInfo;

    // this.takeSub = this.cheetaOkrService.getOkrUpdateListener()
    //   .subscribe(async (data: any) => {
    //     await this.onDelete();
    //   })
  }

  async onDelete(){
    console.log(this.data);
    try{
     await this.cheetaOkrService.deleteOkr(this.data.id);
     this.notification.openDialog('Deleted Successfully');
     this.dialogRef.close();
    }
    catch(err){
      this.notification.openWarningDialog("Something went wrong");
    }


  }

  // ngOnDestroy(): void {
  //   this.takeSub.unsubscribe();
  // }

}
