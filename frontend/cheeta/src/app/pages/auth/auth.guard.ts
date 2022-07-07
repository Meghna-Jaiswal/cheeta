import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";


@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService) {}


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {

    this.authService.autoAuthUser();
    const isAuth = this.authService.getAuthStatus();

    if(!isAuth) {
      this.authService.logout();
    }

    return isAuth;

  }

}
