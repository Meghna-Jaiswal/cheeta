import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pages',
  template: `
    <div class="container">
      <app-header></app-header>
      <app-nav></app-nav>
      <main>
        <router-outlet></router-outlet>
      </main>
      <!-- <app-footer></app-footer> -->
    </div>
  `,
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
