import {
  Component,
  ElementRef,
  Inject,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Ticket } from 'src/app/models/ticket.model';
import { CheetaTagsService } from 'src/app/service/cheetaTags.service';
import { CheetaTicketService } from 'src/app/service/cheetaTicket.service';
import { CheetaUsersService } from 'src/app/service/cheetaUsers.service';
import { FileUploaderService } from 'src/app/service/file-uploader/file-uploader.service';
import { NotificationsService } from 'src/app/service/notification/notifications.service';
import { NotificationsComponent } from '../notifications/notifications.component';
import { WarningDialog } from '../notifications/warning.component';
import { CreateValidation } from '../validations/validation-instance';
import { DeleteComponent } from '../kanban/tickets/delete/delete.component';
import { LogsComponent } from '../kanban/tickets/view/logs/logs.component';
@Component({
  selector: 'app-create-ticket',
  templateUrl: './abc.html',
  styleUrls: ['./abc.scss'],
})
export class CreateTicketComponent implements OnInit {
  @ViewChild('file') file: ElementRef;

  projectNameArr: any = [];
  profilePic: any | '';

  //ngModel names used for form
  createTicket: any = {
    title: '',
    description: '',
    priority: '',

    files: [],
    tags: [],
    members: [],
    comments: [],

    type: '',
    expectedTime: '',
    UT: 'false',
    documentation: 'false',
  };

  membersArr: any = {
    developers: [],
    testers: [],
    others: [],
  };

  member: any;

  addOn = false;
  advanceOn = false;
  labelPosition: 'before' = 'before';

  edit = false;
  btnString = 'Create';

  isClicked: boolean = false;
  public isLoading = false;

  min: Date;

  tags: any;
  show = false;
  cmnt = '';

  constructor(
    public dialogRef: MatDialogRef<CreateTicketComponent>,
    public cheetaTicketService: CheetaTicketService,
    public cheetaUserService: CheetaUsersService,
    public cheetaTagsService: CheetaTagsService,
    public fileUploader: FileUploaderService,
    public dialog: MatDialog,
    public notification: NotificationsService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.min = new Date();
  }

  duedateCrossed = false;
  async ngOnInit() {
    this.isLoading = true;

    let resProjects: any = await this.cheetaTagsService.getProjectsListWithId();
    if (resProjects && resProjects.length) this.loadTags(resProjects);
    let res: any = await this.cheetaUserService.getUserData();
    this.profilePic = res.data.profilePic;

    await this.membersCategory();

    if (this.data.edit) {
      this.isLoading = true;
      this.createTicket = { ...this.data.ticketInfo };
      // if(this.data.ticketInfo.tags) this.createTicket.tags = this.data.ticketInfo.tags.join(', ')
      if (this.data.ticketInfo.UT) this.createTicket.UT = 'true';
      else this.createTicket.UT = 'false';

      if (this.data.ticketInfo.documentation)
        this.createTicket.documentation = 'true';
      else this.createTicket.documentation = 'false';

      this.btnString = 'Edit';
      this.isLoading = false;
      // if(this.)
      if (
        new Date(this.min).getTime() >
        new Date(this.createTicket.expectedTime).getTime()
      ) {
        this.duedateCrossed = true;
      }
    }
    this.isLoading = false;
    console.log(this.data.ticketInfo)
  }

  async onCreate(comment = false) {
    const ticket: any = {
      title: this.createTicket.title,
      description: this.createTicket.description,
      priority: this.createTicket.priority,
      type: this.createTicket.type,
    };

    // if(this.createTicket.type) ticket['type'] = this.createTicket.type;

    if (this.createTicket.UT == 'true') ticket['UT'] = true;
    else ticket['UT'] = false;

    if (this.createTicket.documentation == 'true')
      ticket['documentation'] = true;
    else ticket['documentation'] = false;

    if (this.createTicket.expectedTime)
      ticket['expectedTime'] = this.createTicket.expectedTime;

    if (this.createTicket.members) {
      ticket['members'] = [...this.createTicket.members];
    }
    if (this.createTicket.comments)
      ticket['comments'] = [...this.createTicket.comments];
    if (this.createTicket.files) ticket['files'] = [...this.createTicket.files];

    if (this.createTicket.tags) ticket['tags'] = [...this.createTicket.tags];
    // ticket['tags'] = this.createTicket.tags.replace(/\s+/g, '').split(',');

    if (ticket.title && ticket.description && ticket.priority && ticket.type) {
      let res;

      this.isClicked = true;

      if (!this.data.edit) {
        res = await this.cheetaTicketService.addTicket(ticket);
        if (!comment) this.dialogRef.close();
      } else {
        res = await this.cheetaTicketService.updateTicket(
          this.data.ticketInfo._id,
          ticket, comment
        );
        // this.dialogRef.close();
      }

      // Add a toaster for Success msg and failure msgs accordingly

      // in place of alerts!!!!!!!!
      if (!comment) {
        if (res) {
          this.notification.openDialog(this.btnString + ' Successfully');
          this.isClicked = false;
          // this.dialogRef.close();
        }
      }
    } else if (ticket.title == '') {
      this.notification.openWarningDialog('Title is Required!');
      return;
    } else if (ticket.description == '') {
      this.notification.openWarningDialog('Description is Required!');
      return;
    } else if (ticket.priority == '') {
      this.notification.openWarningDialog('Priority is Required!');
      return;
    } else if (ticket.type == '') {
      this.notification.openWarningDialog('Type is Required!');
      return;
    }
    if (!comment) this.dialogRef.close();
  }

  async membersCategory() {
    let resMembers: any = await this.cheetaUserService.getUsersList();
    // console.log(resMembers);
    resMembers.forEach((a: any) => {
      if (a.type == 'software-developer') this.membersArr.developers.push(a);
      else if (a.type == 'quality-analyst') this.membersArr.testers.push(a);
      else this.membersArr.others.push(a);
    });
  }

  public addMember(ele: Event) {
    let element = ele.target as HTMLSelectElement;

    let flag = 0;
    this.createTicket.members.forEach((e: any) => {
      if (e.userId == element.value) flag++;
    });

    if (flag) return;

    this.membersArr.developers.forEach((e: any) => {
      if (e._id == element.value)
        this.createTicket.members.push({
          name: e.name,
          email: e.email,
          userId: e._id,
          type: e.type,
          profilePic: e.profilePic,
        });
    });
    this.membersArr.testers.forEach((e: any) => {
      if (e._id == element.value)
        this.createTicket.members.push({
          name: e.name,
          email: e.email,
          userId: e._id,
          type: e.type,
          profilePic: e.profilePic,
        });
    });
    this.membersArr.others.forEach((e: any) => {
      if (e._id == element.value)
        this.createTicket.members.push({
          name: e.name,
          email: e.email,
          userId: e._id,
          type: e.type,
          profilePic: e.profilePic,
        });
    });
    // this.member="ashish"
  }

  remove(member: Ticket): void {
    const index = this.createTicket.members.indexOf(member);
    if (index >= 0) {
      this.createTicket.members.splice(index, 1);
    }
  }
  removeFiles(files: any): void {
    const index = this.createTicket.files.indexOf(files);
    if (index >= 0) {
      this.createTicket.files.splice(index, 1);
    }
  }
  copyTicketId() {
    console.log(this.createTicket);
    console.log(this.createTicket.hrId);
    navigator.clipboard
      .writeText(this.createTicket.hrId)
      .then()
      .catch((e) => console.error(e));
  }

  async addComment(comment: any) {
    if (comment.value == '') {
      return;
    }
    let resMembers: any = await this.cheetaUserService.getUsersList();

    let commentObj = {
      user: localStorage.getItem('email'),
      msg: comment.value,
      dateTime: new Date().toISOString(),
      profilePic: this.profilePic,
    };
    console.log(commentObj);
    this.createTicket.comments.push(commentObj);
    this.cmnt = '';
    this.onCreate(true);
  }

  async selectedFile(e: Event) {
    let ele = e.target as HTMLInputElement;

    const FILE = (ele.files as FileList)[0];
// console.log(FILE.name)
    const fileUrl = await this.fileUploader.uploadFile('cheetaFiles', FILE);
    if (
      FILE.type === 'image/png' ||
      FILE.type === 'image/gif' ||
      FILE.type === 'image/jpeg' ||
      FILE.type === 'image/jpg'
    ) {
      setTimeout(() => {
        this.createTicket.files.push(fileUrl);
      }, 1500);
    } else {
      this.createTicket.files.push(fileUrl);
    }
  }

  addTags(event: any) {
    let ele = event.target as HTMLInputElement;
    if (!ele.value) return;
    const value = ele.value.trim();
    this.createTicket.tags.push(value);
    this.tags = '';
  }

  removeTags(event: any) {
    const index = this.createTicket.tags.indexOf(event);

    if (index >= 0) {
      this.createTicket.tags.splice(index, 1);
    }
  }

  loadTags(data: any) {
    for (let i = 0; i < data.length; i++) {
      this.projectNameArr.push('P:' + data[i].name);
      this.projectNameArr.push('B:' + data[i].name);
      this.projectNameArr.push('F:' + data[i].name);
    }
  }
  async openDelete() {
    await this.dialog.open(DeleteComponent, {
      data: { ticketInfo: this.createTicket },
    });
    this.dialogRef.close();
  }

  async showLogs() {
    this.show = true;
    await this.dialog.open(LogsComponent, {
      data: { ticketInfo: this.createTicket },
    });
    this.dialogRef.close();
  }
  hideLogs() {
    this.show = false;
  }

  goToLink(url: string) {
    window.open(url, '_blank');
  }

  imageUrl(file: string) {
    const fileExtention = file.split('.').pop();
    if (
      fileExtention === 'jpg' ||
      fileExtention === 'png' ||
      fileExtention === 'jpeg' ||
      fileExtention === 'gif'
    ) {
      return file;
    } else {
      return 'assets/image/file-icon.png';
    }
  }
}
