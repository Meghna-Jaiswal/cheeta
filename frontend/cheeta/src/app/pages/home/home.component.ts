import { NONE_TYPE } from '@angular/compiler';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DialogRole, MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { CheetaTicketService } from 'src/app/service/cheetaTicket.service';
import { CheetaUsersService } from 'src/app/service/cheetaUsers.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  takeSub: Subscription;

  public bigTask: any = [];
  public smallTask: any = [];

  public score: number = 0
  public topPerformers: any = [];

  ticketSummary: any[] = [];
  userName: any;

  date: any;
  day: any;
  days = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ]

  public isLoading: boolean = true;

  constructor(
    public dialog: MatDialog,
    private cheetaTicketService: CheetaTicketService,
    private cheetaUsersService: CheetaUsersService
  ) { }

  async ngOnInit() {


    this.isLoading = true;

    await this.getDate();
    // get users ticket/tasks
    await this.getUsersTickets();
    // get scores
    await this.getScores();
    // get project wise ticket summary
    await this.getTicketSummary();
    this.isLoading=false;



    this.takeSub = this.cheetaTicketService.getTicketUpdateListener()
      .subscribe(async (data: any) => {
        await this.getUsersTickets();
        await this.getTicketSummary();
        await this.getScores()

      })
  }

  async getDate(){
    this.date = new Date()
    this.day = this.date.getDay();
  }


  async getUsersTickets() {

    this.smallTask = [];
    this.bigTask = [];
    const filters = {
      members: [localStorage.getItem('userId')]
    }

    let result:any = await this.cheetaTicketService.getTickets(filters);

    const userDetails: any = await this.cheetaUsersService.getUserData();
    this.userName = userDetails.data.name;
    let userType = "";

    if(userDetails) userType = userDetails.data.type;
    else return;


    if(
      userType == 'software-developer' ||
      userType == 'tech-trainee' ||
      userType == 'team-leader'
    ) {
      result.forEach((t: any) => {
        if( t.state != "development") return;
        if(t.type == 'small') this.smallTask.push(t)
        if(t.type == 'big') this.bigTask.push(t)
      })
      return;
    }

    if(
      userType == 'quality-analyst' ||
      userType == 'qa-trainee' ||
      userType == 'devOps'
    ) {
      result.forEach((t: any) => {
        if( t.state != "testing") return;
        if(t.type == 'small') this.smallTask.push(t)
        if(t.type == 'big') this.bigTask.push(t)
      })
      return;
    }

    if(
      userType == 'marketing/sales'
    ) {
      result.forEach((t: any) => {
        if(!( t.state == "done" || t.state == "deployed" )) return;
        if(t.type == 'small') this.smallTask.push(t)
        if(t.type == 'big') this.bigTask.push(t)
      })
      return;
    }

    if(
      userType == 'project-manager'
    ) {
      result.forEach((t: any) => {
        if( t.state == "deployed" || t.state == "done" ) return;
        if(t.type == 'small') this.smallTask.push(t)
        if(t.type == 'big') this.bigTask.push(t)
      })
      return;
    }

  }


  async getScores() {
    let result: any = await this.cheetaUsersService.getScore();
    this.score = result.userScore
    this.topPerformers = [...result.topPerformers]
  }


  async getTicketSummary() {
    let result: any = await this.cheetaTicketService.getTicketSummary();
    this.ticketSummary = result;
  }

  ngOnDestroy(): void {
    this.takeSub.unsubscribe();
  }

}
