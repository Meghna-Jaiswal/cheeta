
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotificationsComponent } from 'src/app/pages/notifications/notifications.component';
import { WarningDialog } from 'src/app/pages/notifications/warning.component';


@Injectable({
  providedIn: 'root'
})

export class NotificationsService {

  constructor(
    public dialog: MatDialog
  ) { }

  openWarningDialog(warning: string): void{
    const dialogRef = this.dialog.open(WarningDialog, {
      data: warning,
    });
  }

  openDialog(warning: string): void {
    const dialogRef = this.dialog.open(NotificationsComponent, {
      data: warning,
    });
  }

}
