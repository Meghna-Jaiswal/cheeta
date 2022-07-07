import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { NotificationsService } from "src/app/service/notification/notifications.service";

import { environment } from "src/environments/environment";
import { NotificationsComponent } from "../notifications/notifications.component";

const usersURL = environment.cheetaUserURL;

@Injectable({
  providedIn: 'root'
})


export class AuthService {

  token: string | null = null;
  tokenTimer: any = null;

  private authStatusListener = new Subject<boolean>();
  private authStatus = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    public dialog: MatDialog,
    public notification: NotificationsService
  ) {}

  getToken() {
    return this.token;
  }


  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getAuthStatus() {
    return this.authStatus;
  }



  register(regData: any){
    console.log("api url", usersURL);
    this.http
      .post<any>(usersURL, regData )
        .subscribe((resp) => {
          console.log("lolz ::: new resopnse", resp);
          console.log("userId::", resp.data.userId);
          if(resp && resp.status && resp.status.code == 200) {

              this.router.navigate(['/auth/verifyOTP'],
              { queryParams: { email: resp.data.email, userId: resp.data.userId } });

          }
        }, error => {
          console.log(error);
        });
  }


  verifyOtp(otpData: {}) {
    console.log('verfying otp', otpData)

    this.http
      .post<any>(usersURL + "/verifyOTP", otpData )
        .subscribe((resp) => {
          console.log("lolz ::: new resopnse", resp);
          if(resp && resp.status && resp.status.code == 200)
              this.router.navigate(['/auth/login']);
        }, error => {
          console.log(error);
        });
  }


  autoAuthUser() {
    const authInfo = this.getAuthData();

    if(authInfo) {
      let expiresIn = new Date(authInfo.expirationDate!).getTime() - (new Date()).getTime();

      if(expiresIn > 0) {
        this.token = authInfo.token;
        this.authStatus = true;

        this.tokenTimer = setTimeout(()=> {
          this.logout();
         }, expiresIn)

        this.authStatusListener.next(true);
      }
    }
  }



  login(form: any) {
    console.log("api url :: ", usersURL)
    this.http
      .post<any>( usersURL + 'login', form )
        .subscribe(async (resp) => {
          if(resp) {
            console.log('login res ::', resp)
            this.token = resp.data.token;
            if(this.token != null) {
              let expirationDate = this.getExpirationDate(resp.data.expiresIn);

              this.saveAuthData(resp.data, expirationDate);

              this.tokenTimer = setTimeout(()=> {
                this.logout();
              }, resp.data.expiresIn * 1000)

              this.authStatusListener.next(true);
              this.authStatus = true;

              this.router.navigate(['']);
            }

          }

    }, err => {
      console.log(err);
      // console.log("geetaaa", err);
      // this.authStatusListener.next(false);
    });

}


  logout() {
    this.token = null;
    this.authStatus = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    localStorage.clear();
    this.router.navigate(['/auth/login']);
  }


  private saveAuthData(obj: any, expirationDate: Date) {
    localStorage.setItem('expirationDate', expirationDate.toISOString());
    localStorage.setItem('mobile', obj.mobile);
    localStorage.setItem('token', obj.token);
    localStorage.setItem('email', obj.email);
    localStorage.setItem('userId', obj.userId);
  }


  private getAuthData() {

    if(
      localStorage.getItem("token") &&
      localStorage.getItem("expirationDate")
    ) return  {
        token: localStorage.getItem("token"),
        expirationDate: localStorage.getItem("expirationDate")
      };

    return false;
  }

  private getExpirationDate(expiresIn: any) {
    let now = new Date();
    return new Date(now.getTime() + expiresIn * 1000);
  }

  resendOtp(email:string){
    console.log(email);
    return new Promise((resolve, reject) => {
      try {
        this.http
          .post<any>
            (usersURL + '/forgetPassword', {email})
          .subscribe((resp) => {
            console.log("resp of send otp for pass forget", resp);
            if (resp && resp.status.code == 200) {
              console.log('OTP sent')

            }
            resolve(resp)
          }, error => {
            console.log(error);
            reject(error);
          });
      } catch (err) {
        console.log("inside catch err", err);
        reject(err);
      }
    })
  }

  changePassword(data: any){
    console.log("data", data);
    return new Promise((resolve, reject) => {
      try {
        this.http
          .post<{ status:any; data: any }>(usersURL + '/newPassword', data)
          .subscribe((resp) => {
            console.log(resp)
            console.log(resp.status);
            if (resp && resp['status'] && resp['status'].code == 200) {
              this.openDialog(' Your Password has been Updated');
                this.router.navigate(['/auth/login']);
            }
          }, error => {
            console.log(error);
            reject(error)
          })
      } catch (err) {
        console.log("inside catch err of resetPass", err);
        reject(err);
      }
    })
  }

  openDialog(warning: string): void {
    const dialogRef = this.dialog.open(NotificationsComponent, {
      data: warning,
    });
  }
}
