import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CheetaUsersService } from 'src/app/service/cheetaUsers.service';
import { AuthService } from '../../auth/auth.service';
import { CreateTicketComponent } from '../../create-ticket/create-ticket.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  userProfile: any = '';
  recentSearch: any = [];

  constructor(
    public dialog: MatDialog,
    public authService: AuthService,
    public cheetaUsersService: CheetaUsersService,
    public router: Router
  ) {}

  async ngOnInit() {
    const res: any = await this.cheetaUsersService.getUserData();
    this.userProfile = res.data.profilePic;
    if (localStorage.getItem('recentSearch')) {
      let arr: any = localStorage.getItem('recentSearch');
      this.recentSearch = [...JSON.parse(arr)];
    }
  }

  openDialog(): void {
    const d = this.dialog.open(CreateTicketComponent, {
      data: {
        edit: false,
        ticketInfo: {},
      },
    });
  }

  async onLogout() {
    await this.authService.logout();
  }
  changeInSearch(e: Event) {
    let ele = e.target as HTMLInputElement;
    if (ele.value === '') this.router.navigate(['/kanban']);
  }

  search(e: Event) {
    let ele = e.target as HTMLInputElement;
    this.router.navigate(['/kanban'], { queryParams: { search: ele.value } });
  }
}
