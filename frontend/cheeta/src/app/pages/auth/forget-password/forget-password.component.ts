import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {Router } from '@angular/router';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { WarningDialog } from '../../notifications/warning.component';
import { AuthService } from '../auth.service';
// import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss',
  '../login/login.component.scss']
})
export class ForgetPasswordComponent implements OnInit {


  isLinear = true;
  showPassword = false;
  newPassword:string = "";
  newPassValid = false;
  conPassword:string = "";
  conPassValid = false;
  notMatch = true;
  email:any;
  otp:any;
  otpValid=true;
  emailValid=true;
  validEmail:boolean=false;
  otpTitle = false;
  conPassTitle = false;
  newPassTitle = false;
  emailTitle = false;
otpIscorrect=false;
  constructor(
    public authService: AuthService,
    public dialog: MatDialog,
    public router: Router
  ) { }

  ngOnInit(): void {
    // this.email = this.route.snapshot.queryParamMap.get('email');
  }


  onEmailKeyUp(){
    this.emailTitle = true;
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(this.email.match(mailformat))
      this.emailValid=true,this.validEmail= true;
    else this.emailValid = false;
  }


  async onSendOtp(){
    if(this.email && this.emailValid){
      try {
        await this.authService.resendOtp(this.email);
        this.validEmail = true;

      }catch(e) {
        this.ngOnInit()
        // this.router.navigate(["/auth/forgetPassword"])
      }
    }
  }

  onOtpKeyUp(){
    this.otpTitle = true;
    if(
      this.otp.toString().length != 4
    ) this.otpValid = false;
    else this.otpValid = true;
  }

  onNewPassKeyUp(){
    this.newPassTitle = true;
    if(
      this.newPassword.length > 20 ||
      this.newPassword.length < 6
    ) this.newPassValid = false;
    else this.newPassValid = true;
  }

  onConfirmPassKeyUp(){
    this.conPassTitle = true;
    if(
      this.conPassword.length > 20 ||
      this.conPassword.length < 6
    ) this.conPassValid = false;
    if(this.newPassword != this.conPassword)
      this.notMatch = false
    else {
      this.conPassValid = true;
      this.notMatch = true;
    }
    console.log("no matched", this.newPassword, this.conPassword, this.notMatch);
  }


  async onChangePassword(){
    console.log(this.email);
    if(this.newPassword != '' && this.conPassword != '' && this.otp && this.newPassValid && this.otpValid && this.conPassValid){
      let data = {
        otp: this.otp,
        newPassword: this.newPassword,
        conPassword: this.conPassword ,
        email: this.email
      }

      try {
        await this.authService.changePassword(data);
        this.openDialog(' Successfully');
      }catch(e) {
        this.router.navigate(['/auth/forgetPassword']);
      }
    }

  }

  getInputType() {
    if (this.showPassword) {
      return 'text';
    }
    return 'password';
  }
  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

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
