import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

const OKR_BASE_URL = environment.okrUrl;

@Injectable({
  providedIn: 'root'
})

export class CheetaOkrService {

  private okrUpdated = new Subject<any>();

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  getOkrUpdateListener() {
    return this.okrUpdated.asObservable();
  }

  createOkr(okr: any) {
    return new Promise((resolve, reject) => {
      try {
        this.http
          .post(OKR_BASE_URL, okr)
          .subscribe(async (res: any) => {
            this.okrUpdated.next(1);
              resolve(res);
          });
      } catch (err) {
        reject (err);
      }
    });
  }

  getOkr() {
    return new Promise((resolve, reject) => {
      try {
        this.http.get(OKR_BASE_URL + localStorage.getItem('userId'))
          .subscribe( async (res: any) => {

            resolve(res.data)
          },
            (err) => {
              reject(err);
            });
      } catch (err) {
        reject(err)
      }
    }
    );
  }

  //function to delete tickets
  public deleteOkr(id: string) {
    console.log(id);
    return new Promise((resolve, reject) => {
      try {
        this.http
          .delete(OKR_BASE_URL + id)
          .subscribe(async (res) => {
            this.okrUpdated.next(1);
            resolve(res);
          });
      } catch (err) {
        reject(err);
      }
    });
  }

}
