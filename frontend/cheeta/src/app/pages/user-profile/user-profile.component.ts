import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CheetaUsersService } from 'src/app/service/cheetaUsers.service';
import { FileUploaderService } from 'src/app/service/file-uploader/file-uploader.service';
import { NotificationsService } from 'src/app/service/notification/notifications.service';
import { environment } from 'src/environments/environment';
import { NotificationsComponent } from '../notifications/notifications.component';
import { WarningDialog } from '../notifications/warning.component';
// import { WarningDialog } from '../warning.component';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  //variable names taken for edit
  userProfile: any={
    name: "",
    mobile: '',
    email: '',
    profilePic: '',
    type: '',
    telegram : {
      id:'',
      username: ''
    }
  }

  roleTypeArr: any[] = environment.roleTypeArray;
  isLoading =false;

  constructor(
    public cheetaUsersService: CheetaUsersService,
    public fileUploader: FileUploaderService,
    public dialog: MatDialog,
    public notification: NotificationsService
  ) { }

   async ngOnInit(){

    this.isLoading =true;
    const res: any = await this.cheetaUsersService.getUserData();
     await this.updateUi(res.data);
     this.isLoading = false;

  }

  //filepicker function for updating profile pic
  async onFilePicked(e: Event) {
    this.isLoading =true;
    let ele = (e.target as HTMLInputElement);
    const FILE = (ele.files as FileList)[0];

    let isValid = await this.validateImgUrl(FILE );

    if(isValid){
      
      const fileUrl = await this.fileUploader.uploadFile('cheetaFiles/userProfile', FILE)
      setTimeout(()=> {
        this.userProfile.profilePic = fileUrl;
      }, 1500)
      this.isLoading =false;
    }
    else{
      this.notification.openWarningDialog("File is not supported");
    }
  }


  //funtion used on click of edit option
  async onEdit(){
    const userProfile: any = {
      name: this.userProfile.name,
      mobile: this.userProfile.mobile,
      profilePic: this.userProfile.profilePic,
      type: this.userProfile.type,
      telegram: {
        id: this.userProfile.telegram.id,
        username: this.userProfile.telegram.username
      }
    }
    if(userProfile){
      await this.cheetaUsersService.updateUser(userProfile);
      this.notification.openDialog('Updated Succeffully ');
    }
    else{
      this.notification.openWarningDialog('Error in Updating');
    }
  }

  

  updateUi(userObj:any){

    this.isLoading = true;

    this.userProfile.name=userObj.name;
    this.userProfile.mobile=userObj.mobile;
    this.userProfile.email = userObj.email;
    this.userProfile.type=userObj.type;
    this.userProfile.profilePic = userObj.profilePic;
    this.userProfile.telegram.id = userObj.telegram.id;
    this.userProfile.telegram.username = userObj.telegram.username

    this.isLoading = false;
  }

   validateImgUrl(file: any) {

    let m = file.name.split('.').pop();
    const fileType= [ 'jpg' , 'jpeg' , 'png' , 'gif' , 'svg' , 'bmp' , 'webp' ];

    let result = false;
    fileType.forEach(a=>{
      if(a==m)
        result = true;
    });
    
    return result;
  }

}
