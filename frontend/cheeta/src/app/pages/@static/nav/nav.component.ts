import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  userName: any = "User";

  constructor() { }

  ngOnInit(): void {
    this.userName = localStorage.getItem('email')?.split('@')[0]
  }

}
