import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";



@Injectable()

export class AuthInterceptor implements HttpInterceptor {


  constructor(private authService: AuthService){}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = localStorage.getItem('token');

    const authRequest = req.clone({
      headers: req.headers.set("authorization", authToken||'khul ja sim sim')
    })

    return next.handle(authRequest)

  }


}
