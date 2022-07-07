import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {

  message = "Unknown Error";

  constructor(@Inject(MAT_DIALOG_DATA) public data:any, public dialog: MatDialog) {
    this.message = data.message;
   }

  ngOnInit(): void {
  }

  close(){
    this.dialog.closeAll();
 }

}
