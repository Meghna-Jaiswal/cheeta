import { Component, Inject, Optional } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";




@Component({
  selector: 'warning-dialog',
  template: `

      <div class="container">
        <div class="header">
          <div class="cross"></div>
        </div>
        <div class="msg">
          <p>{{warning}}</p>
        </div>
        <div class="btn">
          <button (click)="onNoClick()">OK</button>
        </div>
      </div>
  `,
  styles: [`
  @use '/src/variables';
      .container {
        width: 100%;
        max-width: 450px;
        background-color: variables.$primary-colour ;
        border: 2px solid variables.$text-colour;
      }

      .header {
        width: 100%;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 10px 0;
      }

      .cross {
        height: 45px;
        width: 45px;
        border-radius: 50%;
        background-color:#FF0000;
        position: relative;
      }
      .cross::after, .cross::before {
        content: "";
        position: absolute;
        left: 50%;
        top: 50%;
        background-color: #FFF;
      }

      .cross::after {
        height: 20px;
        width: 4px;
        transform: translate(-50%, -70%);
      }
      .cross::before {
        height: 4px;
        width: 4px;
        border-radius: 50%;
        transform: translate(-50%, 230%);
      }


      .msg {
        padding: 20px 20px 10px;
      }
      .msg>p {
        color: variables.$text-colour;
        text-align: center;
      }

      .btn {
        padding: 10px 0 20px;
        text-align: center;
      }

      .btn>button {
        padding: 8px 35px;
        background-color: variables.$secondary-colour;
        font-size: 1.1rem;
        color: variables.$text-colour;
        border: none;
        outline: none;
        border-radius: 3px;
        transition: all 300ms ease-in-out;
        cursor: pointer;
      }

  `]
})
export class WarningDialog {
  constructor(
    @Optional() public dialogRef: MatDialogRef<WarningDialog>,
    @Inject(MAT_DIALOG_DATA) public warning: string,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
