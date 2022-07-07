import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { WarningDialog } from '../../notifications/warning.component';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  email: string = "";
  password: string = "";

  showPassword = false;
  emailValid = true;
  passValid = true;
  emailTitle = false;
  passTitle = false;

  hide= true;

  constructor(public authService: AuthService, private router: Router , public dialog: MatDialog) { }

  ngOnInit(): void {
    this.authService.autoAuthUser()
    let auth = this.authService.getAuthStatus();
    if(auth){
      this.router.navigate(['/']);
    }
  }

  async onLogin() {
    if (this.email != '' && this.password != '' && this.emailValid && this.passValid) {
      let loginForm = {
        email: this.email,
        password: this.password
      }

      await this.authService.login(loginForm);
    }
    else{
      this.openWarningDialog("All fields are required");
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
  onEmailKeyUp() {
    this.emailTitle = true;
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (this.email.match(mailformat))
      this.emailValid = true;
    else this.emailValid = false;
  }
  onPassKeyUp() {
    this.passTitle = true;
    if (this.password) {
      if (
        this.password.length > 20 ||
        this.password.length < 6
      ) this.passValid = false;
      else this.passValid = true;
    }
  }

  //functionn for opening dialog box for warning
openWarningDialog(warning: string): void{
  const dialogRef = this.dialog.open(WarningDialog, {
    data: warning,
  });
}

}
