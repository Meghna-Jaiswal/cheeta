import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserData } from 'src/app/models/user.model';
import { NotificationsService } from 'src/app/service/notification/notifications.service';
import { environment } from 'src/environments/environment';
import { WarningDialog } from '../../notifications/warning.component';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  userObj = {
    name: "",
    mobile: "",
    type: "Developer",
    email: "",
    password: "",
    confirmPassword: "",
    
  }

  countryCode:string = '+91';
  error: string = "";

  userNameValid = true;
  phoneValid = true;
  emailValid = true;
  typeValid = true;
  passValid = true;
  emailTitle = false;
  passTitle = false;
  userTitle = false;
  typeTitle = false;
  phoneTitle = false;

  roleTypeArr: any[] = environment.roleTypeArray;

  hide=true;

  constructor( 
    public router: Router, 
    public authService: AuthService,
    public dialog: MatDialog,
    public notification: NotificationsService
   ) { }

  ngOnInit(): void {
    this.authService.autoAuthUser()
    let auth = this.authService.getAuthStatus();
    if(auth){
      this.router.navigate(['/']);
    }
  }

  onUserNameKeyUp(){
    this.userTitle = true;
    if(
      this.userObj.name.length > 30 ||
      this.userObj.name.length < 5
    ) this.userNameValid = false;
    else this.userNameValid = true;
  }

  onTypeOption(){
    this.typeTitle = true;
    if(
      this.userObj.type ==''
    ) this.typeValid = false;
    else this.typeValid = true;
  }

  onPhoneKeyUp(){
    this.phoneTitle = true;
    if(
      this.userObj.mobile.toString().length != 10
    ) this.phoneValid = false;
    else this.phoneValid = true;
  }
  onEmailKeyUp(){
    this.emailTitle = true;
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(this.userObj.email.match(mailformat))
      this.emailValid = true;
    else this.emailValid = false;
}
onPassKeyUp(){
  this.passTitle = true;
  if(
    this.userObj.password.length > 20 ||
    this.userObj.password.length < 6
  ) this.passValid = false;
  else this.passValid = true;
}

async onRegister(){
  
  
  if( this.userObj.name != '' && this.userObj.mobile != '' && this.userObj.email != '' && this.userObj.password != '' && this.userObj.type != '' && this.userObj.confirmPassword != ''
  &&  this.userNameValid && this.phoneValid && this.emailValid && this.passValid && this.userObj.type && this.userObj.confirmPassword ==this.userObj.password ){

    const regForm: UserData = {
      name: this.userObj.name,
      mobile: this.userObj.mobile,
      email: this.userObj.email,
      password: this.userObj.password,
      type: this.userObj.type,
    }
    await this.authService.register(regForm);


  }
  else if(this.userObj.name=='') this.userNameValid = false;
  else if(this.userObj.mobile=='') this.phoneValid = false;
  else if(this.userObj.email=='') this.emailValid = false;
  else if(this.userObj.type=='') this.typeValid = false;
  else if(this.userObj.password == '') this.passValid = false;
  else if(this.userObj.confirmPassword  == '') this.passValid = false;
   else if(this.userObj.confirmPassword ==this.userObj.password){
    this.notification.openWarningDialog("Password and confirm passoword must be same");
  }

  else{
    this.notification.openWarningDialog("All fields are required");
  }
}



}
