import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Observable, timer } from 'rxjs';
import { take, map } from 'rxjs/operators';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OtpComponent implements OnInit {

  email: any = "";
  userId: any = "";
  otp: string = "";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService ) { }

  ngOnInit(): void {
    this.authService.autoAuthUser()
    let auth = this.authService.getAuthStatus();
    if(auth){
      this.router.navigate(['/']);
    }

    this.email = this.route.snapshot.queryParamMap.get('email');
    this.userId = this.route.snapshot.queryParamMap.get('userId');

  }


  async submitOtp() {

    await this.authService.verifyOtp({
      email: this.email,
      userId: this.userId,
      otp: this.otp
    });

  }


  // Resend Otp


}
