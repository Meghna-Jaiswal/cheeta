import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { UserProfile } from '../models/userProfile.model';

const CHEETA_USERS_URL = environment.cheetaUserURL;

@Injectable({
  providedIn: 'root'
})
export class CheetaUsersService {

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  updateUser(userProfile: UserProfile){
    return new Promise((resolve, reject) => {
      this.http.put(CHEETA_USERS_URL + localStorage.getItem('userId'), userProfile).subscribe(async res => {

        resolve(res)
      },
      (err) => {
        reject(err);
      });
    });
  }

  async getUserData(userId = localStorage.getItem('userId')){
    return new Promise((resolve, reject)=>{
      this.http.get(CHEETA_USERS_URL + userId )
      .subscribe(async res=>{
        resolve(res)
      },
      (err)=>{
        reject(err);
      });
    });

  }

  //function used for getting members list from backend to import members of organization with valid emails
  getUsersList() {
    return new Promise((resolve, reject)=>{
      this.http.get(CHEETA_USERS_URL + "getUsersList" )
      .subscribe((res: any)=>{
        resolve(res.data);
      },
      (err)=>{
        reject(err);
      });
    });
  }


  getScore() {
    return new Promise((resolve, reject)=>{
      this.http.get(CHEETA_USERS_URL + "getScores" )
      .subscribe((res: any)=>{
        // console.log(res)
        resolve(res.data);
      },
      (err)=>{
        reject(err);
      });
    });
  }

}
