import { Component, OnDestroy, OnInit } from '@angular/core';
import { CheetaTicketService } from 'src/app/service/cheetaTicket.service';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { filters } from 'src/app/models/filters.model';
import { CheetaUsersService } from 'src/app/service/cheetaUsers.service';
import { CheetaTagsService } from 'src/app/service/cheetaTags.service';
import { Subscription } from 'rxjs';
import { WarningDialog } from '../notifications/warning.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.scss'],
})
export class KanbanComponent implements OnInit, OnDestroy {
  takeSub: Subscription = new Subscription();

  backlog: any = [];
  development: any = [];
  devdone: any = [];
  testing: any = [];
  done: any = [];
  deployed: any = [];
  delivered: any = [];

  //filters option variables
  projectName: any[] = [];
  members: any[] = [];
  priority: any[] = [];
  state: any[] = [
    'backlog',
    'development',
    'devdone',
    'testing',
    'done',
    'deployed',
    'delivered',
  ];
  projectNameArr: any[] = [];

  //for members Filters
  membersArr: any = {
    developers: [],
    testers: [],
    others: [],
  };
  role: any;

  showState: any = {
    backlog: true,
    development: true,
    devdone: true,
    testing: true,
    done: true,
    deployed: true,
    delivered: true,
  };

  public isLoading: boolean = true;

  constructor(
    public route: ActivatedRoute,
    public cheetaTicketService: CheetaTicketService,
    public cheetaUserService: CheetaUsersService,
    public cheetaTagsService: CheetaTagsService,
    public cheetaUsersService: CheetaUsersService,
    public dialog: MatDialog
  ) {}

  async ngOnInit() {
    this.isLoading = true;
    const res: any = await this.cheetaUsersService.getUserData();
    this.role = res.data.type;
    console.log(this.role);

    this.route.queryParamMap.subscribe(async (paramMap: ParamMap) => {
      if (paramMap.has('search')) {
        // Use search instead of get
        await this.searchTicket(paramMap.get('search'));
      } else await this.loadPrevFilters();
    });

    await this.membersCategory();

    let resProjects: any = await this.cheetaTagsService.getProjectsListWithId();
    if (resProjects && resProjects.length) this.projectNameArr = resProjects;

    this.takeSub = this.cheetaTicketService
      .getTicketUpdateListener()
      .subscribe(async (data: any) => {
        await this.onApply();
      });
  }

  async searchTicket(search: any) {
    let result = await this.cheetaTicketService.searchTicket(search);
    if (result) {
      this.loadTickets(result);
      let arr = [];
      if (localStorage.getItem('recentSearch')) {
        let a: any = localStorage.getItem('recentSearch');
        arr = [...JSON.parse(a)];
        let check = arr.filter((i) => {
          if (i == search) return i;
        });
        if (!(check.length > 0)) {
          arr.unshift(search);
          if (arr.length > 5) arr.pop();
          localStorage.setItem('recentSearch', JSON.stringify(arr));
        }
        return;
      }

      arr.unshift(search);
      localStorage.setItem('recentSearch', JSON.stringify(arr));
    }
  }

  async drop(event: CdkDragDrop<any>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      const t = this.transferValid(
        event.previousContainer.id,
        event.container.id
      );
      if (!t) {
        this.openWarningDialog('Not valid Movement');
        return;
      }
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      this.autoAddUser(event.container.data[event.currentIndex]);
      this.updateTicketStatus(event.container.data[event.currentIndex], {
        prev: event.previousContainer.id,
        new: event.container.id,
        prevData: event.previousContainer.data,
        newData: event.container.data,
        prevIndex: event.previousIndex,
        newIndex: event.currentIndex,
      });
    }
  }

  conditions = () => () => {};

  transferValid(prevState: any, newState: any) {
    console.log('trasferValid', {
      prevState,
      newState,
      role: this.role,
    });
    const sudoRoles = ['team-leader', 'project-manager', 'ceo', 'cto'];
    const qaRoles = []
    // if (sudoRoles.indexOf(this.role) >= 0) return true;

    // ALL THE TYPES
    const stateType = [
      'backlog',
      'development',
      'devdone',
      'testing',
      'done',
      'deployed',
      'delivered',
    ];
    const devType = ['backlog', 'development', 'devdone'];
    const qaType = ['devdone', 'testing', 'done', 'deployed'];
    if (sudoRoles.indexOf(this.role) >= 0) {
      const sudoStateTypes = stateType.slice(0, -1);
      if (
        sudoStateTypes.indexOf(newState) ==
        sudoStateTypes.indexOf(prevState) + 1
      )
        return true;
    }

    if (
      devType.indexOf(newState) ==
      devType.indexOf(prevState) + 1
      //&& devType.indexOf(prevState) !== 2
    ) {
      return true;
    }
    if (
      qaType.indexOf(newState) == qaType.indexOf(prevState) + 1 &&
      (this.role === 'quality-analyst' || this.role === 'qa-trainee')
    ) {
      return true;
    }
    if (
      prevState === 'deployed' &&
      newState === 'delivered' &&
      this.role === 'client-qa'
    ) {
      return true;
    }
    // if (
    //   prevState === 'devdone' &&
    //   newState === 'testing' &&
    //   (this.role === 'quality-analyst' || this.role === 'qa-trainee')
    // ) {
    //   return true;
    // }

    // if (
    //   prevState === 'done' &&
    //   newState === 'deployed' &&
    //   // && localStorage.getItem('userId') === '621866bce13d06751ca5b6b3' &&
    //   (this.role === 'quality-analyst' || this.role === 'qa-trainee')
    // ) {
    //   return true;
    // }

    if (
      stateType.indexOf(newState) < stateType.indexOf(prevState) &&
      newState == 'backlog'
    )
      return true;

    return false;
  }

  // it will work on two conditions
  // * onInIt
  // * using filters
  async getTickets(filters: any) {
    let result: any = await this.cheetaTicketService.getTickets(filters);
    // console.log(result)
    if (result) {
      this.loadTickets(result);
    }
  }

  loadTickets(data: any) {
    this.backlog = [];
    this.development = [];
    this.devdone = [];
    this.testing = [];
    this.deployed = [];
    this.done = [];
    this.delivered = [];
    data.forEach((i: any) => {
      i['createdDaysAgo'] = Math.ceil(Math.abs((+new Date()) - (+new Date(i.createdAt))) / (1000 * 60 * 60 * 24));
      i['updatedDaysAgo'] = Math.ceil(Math.abs((+new Date()) - (+new Date(i.updatedAt))) / (1000 * 60 * 60 * 24));

      if (i.state == 'backlog') this.backlog.unshift(i);
      if (i.state == 'development') this.development.unshift(i);
      if (i.state == 'devdone') this.devdone.unshift(i);
      if (i.state == 'testing') this.testing.unshift(i);
      if (i.state == 'deployed') this.deployed.unshift(i);
      if (i.state == 'done') this.done.unshift(i);
      if (i.state == 'delivered') this.delivered.unshift(i);
    });
    this.isLoading = false;
  }

  async loadPrevFilters() {
    if (
      localStorage.getItem('lastFilter') &&
      localStorage.getItem('lastFilter') !== '{}'
    ) {
      let filterOption: any;
      filterOption = localStorage.getItem('lastFilter');
      filterOption = JSON.parse(filterOption);
      await this.getTickets(filterOption);

      // add filters to filters drop down
      if (filterOption['members']) this.members = [...filterOption['members']];
      if (filterOption['priority'])
        this.priority = [...filterOption['priority']];
      if (filterOption['project'])
        this.projectName = [...filterOption['project']];
      if (filterOption['state']) this.projectName = [...filterOption['state']];
    } else {
      await this.getTickets({});
    }
  }

  async updateTicketStatus(ticket: any, states: any) {
    const changes = {
      states: {
        prev: states.prev,
        new: states.new,
      },
      user: await this.getUserDets(),
    };

    try {
      let result: any = await this.cheetaTicketService.updateTicketState(
        ticket,
        changes
      );
      console.log(result);
    } catch (err) {
      transferArrayItem(
        states.newData,
        states.prevData,
        states.newIndex,
        states.prevIndex
      );

      this.openWarningDialog('' + err);
      return;
    }
  }

  async onApply() {
    this.isLoading = true;
    const filterOption: any = {};

    if (this.members.length) filterOption['members'] = [...this.members];
    if (this.priority.length) filterOption['priority'] = [...this.priority];

    if (this.projectName.length)
      filterOption['project'] = [...this.projectName];
    // if(this.state.length) filterOption['state'] = [...this.state];

    await this.getTickets(filterOption);
    localStorage.setItem('lastFilter', JSON.stringify(filterOption));
  }

  openWarningDialog(warning: string): void {
    const dialogRef = this.dialog.open(WarningDialog, {
      data: warning,
    });
  }

  async autoAddUser(ticket: any) {
    let flag = ticket.members.filter((m: any) => {
      if (m.userId == localStorage.getItem('userId')) return m;
    });

    if (!flag.length) {
      let members = [...ticket.members, await this.getUserDets()];
      await this.cheetaTicketService.updateTicket(ticket._id, { members });
    }
  }

  async membersCategory() {
    let resMembers: any = await this.cheetaUserService.getUsersList();

    resMembers.forEach((a: any) => {
      if (a.type == 'software-developer') this.membersArr.developers.push(a);
      else if (a.type == 'quality-analyst') this.membersArr.testers.push(a);
      else this.membersArr.others.push(a);
    });
  }

  async getUserDets() {
    let userDets: any = await this.cheetaUserService.getUserData();
    console.log('userDetails', userDets);
    if (userDets.data)
      return {
        email: userDets.data.name,
        type: userDets.data.type,
        userId: userDets.data._id,
        profilePic: userDets.data.profilePic ? userDets.data.profilePic : '',
      };
    return {};
  }

  showHideColumns() {
    Object.keys(this.showState).forEach((key) => {
      if (this.state.includes(key)) {
        this.showState[key] = true;
        return;
      }
      this.showState[key] = false;
    });
  }

  ngOnDestroy(): void {
    this.takeSub.unsubscribe();
  }
}
