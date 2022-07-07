import { Component, OnInit } from '@angular/core';
import { CheetaOkrService } from 'src/app/service/cheetaOkr.service';
import { NotificationsService } from 'src/app/service/notification/notifications.service';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-okr-form',
  templateUrl: './okr-form.component.html',
  styleUrls: ['./okr-form.component.scss']
})
export class OkrFormComponent implements OnInit {

  okr: any = {
    objective: '',
    actions: [],
    results: []
  }
  action: string = '';
  result: string = '';

  objectiveTitle = false;
  actionTitle = false;
  resultTitle = false;

  objectiveValid = true;
  actionValid = true;
  resultValid = true;

  isClicked: boolean = false;

  constructor(
    public cheetaOkrService: CheetaOkrService,
    public notifications: NotificationsService,
    public dialogRef: MatDialogRef<OkrFormComponent>,
  ) { }

  ngOnInit(): void { }

  async onSubmit() {
    try{
      let OKR = {
        userId: localStorage.getItem('userId'),
        objective: this.okr.objective,
        actions: [...this.okr.actions],
        results: [...this.okr.results]
      }
      if (OKR.objective && OKR.actions.length >0 && OKR.results.length >0 ) {
        let res;
        this.isClicked = true;
        res = await this.cheetaOkrService.createOkr(OKR);
        if(res) {
          this.notifications.openDialog('Created  Successfully');
          this.dialogRef.close();
        }
      }
      else{
        this.notifications.openWarningDialog('All Field Are Required');
        return;
      }


    }
    catch{

    }


  }

  addAction(event: any) {
    console.log(this.action);
    if(this.action == ''){
      this.actionValid = false;
    }
    else{
      this.okr.actions.push(this.action);
      this.action = '';
      this.actionValid = true;
    }
  }

  removeAction(event: any): void {
    const index = this.okr.actions.indexOf(event);
    if (index >= 0) {
      this.okr.actions.splice(index, 1);
    }
  }

  addResult(event: any) {
    if(this.result == ''){
      this.resultValid = false;
    }
    else{
      this.okr.results.push(this.result);
      this.result = '';
      this.resultValid = true;
    }
  }

  removeResult(event: any): void {
    const index = this.okr.results.indexOf(event);
    if (index >= 0) {
      this.okr.results.splice(index, 1);
    }
  }



}
