import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

const TAGS_BASE_URL = environment.tagsUrl;

@Injectable({
  providedIn: 'root'
})

export class CheetaTagsService {

  smallTaskArr: any[] = [];
  bigTaskArr: any[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  getProjectsList() {
     // console.log("in service")
     return new Promise((resolve, reject) => {
      try {
        this.http
          .get(TAGS_BASE_URL + 'projectsList')
          .subscribe((res: any) => {
            resolve(res.data)
          });
      } catch (err) {
        console.log(err)
      }
    });
  }
  getProjectsListWithId() {
    // console.log("in service")
    return new Promise((resolve, reject) => {
     try {
       this.http
         .get(TAGS_BASE_URL + 'projectsWithIds')
         .subscribe((res: any) => {
           resolve(res.data)
         });
     } catch (err) {
       console.log(err)
     }
   });
 }

}
