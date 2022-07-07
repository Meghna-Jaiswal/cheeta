import { Component, OnInit } from '@angular/core';
import { CheetaTicketService } from 'src/app/service/cheetaTicket.service';
import { CheetaUsersService } from 'src/app/service/cheetaUsers.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-all-task',
  templateUrl: './all-task.component.html',
  styleUrls: ['./all-task.component.scss']
})
export class AllTaskComponent implements OnInit{

  // takeSub: Subscription;

  // ticketSummary: any[] = [];

  public bigTask: any = [];
  public smallTask: any = [];

  membersId: any= [];
  member= '';

  membersArr: any ={
    developers : [],
    testers : [],
    others : []
  }

  public isLoading = false;

  constructor(
    public cheetaUsersService: CheetaUsersService,
    public cheetaTicketService: CheetaTicketService,
  ) { }

  async ngOnInit() {
    this.isLoading=true;
    await this.membersCategory();
    // await this.getTicketSummary();
    this.isLoading=false;


    // this.takeSub = this.cheetaTicketService.getTicketUpdateListener()
    // .subscribe(async (data: any) => {
    //   await this.getTicketSummary();

    // })

  }

  // async getTicketSummary() {
  //   let result: any = await this.cheetaTicketService.getTicketSummary();
  //   this.ticketSummary = result;
  //   console.log(this.ticketSummary)
  // }


   async membersCategory(){

    let resMembers: any = await this.cheetaUsersService.getUsersList();

    resMembers.forEach((a: any) => {
      if(a.type == 'software-developer') this.membersArr.developers.push(a);
      else if(a.type == 'quality-analyst') this.membersArr.testers.push(a);
      else this.membersArr.others.push(a);
    });
  }

  async getUsersTickets() {
    this.isLoading = true;
    this.smallTask = [];
    this.bigTask = [];
    const filters = {
      members: [this.member]
    }


    let result:any = await this.cheetaTicketService.getTickets(filters);

    this.isLoading = false;
    const userDetails: any = await this.cheetaUsersService.getUserData(this.member);
    // this.userName = userDetails.data.name;
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

  // ngOnDestroy(): void {
  //   this.takeSub.unsubscribe();
  // }
}
