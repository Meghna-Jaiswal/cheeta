import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { CheetaOkrService } from 'src/app/service/cheetaOkr.service';
import { NotificationsService } from 'src/app/service/notification/notifications.service';
import { DeleteComponent } from './delete/delete.component';
import { OkrFormComponent } from './okr-form/okr-form.component';

@Component({
  selector: 'app-okr',
  templateUrl: './okr.component.html',
  styleUrls: ['./okr.component.scss']
})
export class OkrComponent implements OnInit, OnDestroy {

  takeSub: Subscription;

  okr: any= [];

  constructor(
    public dialog: MatDialog,
    public cheetaOkrService: CheetaOkrService,
    public notification: NotificationsService
  ) { }

  async ngOnInit() {
    await this.getOkrData();

    this.takeSub = this.cheetaOkrService.getOkrUpdateListener()
    .subscribe(async (data: any)=>{

      await this.getOkrData();
    })
  }
//  okrLength=0;
  async getOkrData(){
    this.okr = [];
    const okr_ = await this.cheetaOkrService.getOkr()
    if(okr_ !== undefined) this.okr = okr_
    console.log(this.okr)
  }

  openOkr(){
    this.dialog.open(OkrFormComponent);
  }

  async openDelete(id: string){
    await this.dialog.open(DeleteComponent, {data: {id: id}})
 }

 ngOnDestroy(): void {
  this.takeSub.unsubscribe();
}

}
