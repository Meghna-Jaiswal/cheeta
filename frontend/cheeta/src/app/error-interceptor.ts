import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { ErrorComponent } from "./error/error.component";



@Injectable()

export class ErrorInterceptor implements HttpInterceptor {


  constructor(public dialog: MatDialog) {}

  intercept(res: HttpRequest<any>, next: HttpHandler) {

    return next.handle(res).pipe(
      catchError((err: HttpErrorResponse) => {
        let errorMsg = "Unknown Error.!";

        if(err.error && err.error.status.message) errorMsg = err.error.status.message;

        this.dialog.open(ErrorComponent, {
          width: '300px',
          data: {
            message: errorMsg
          }
        });

        return throwError(err);
      })
    );

  }


}
