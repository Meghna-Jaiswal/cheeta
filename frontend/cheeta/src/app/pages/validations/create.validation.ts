import { CreateValidation } from "./validation-instance";

export class Validation {

  public validateURL(name: string, instance: CreateValidation) {
    if (!name.match(/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/)) {
      instance.errorMessage = 'Invalid Url';
    }
    else if (name.length == 0 || name.length < 15) {
      instance.errorMessage = "Invalid url";
    }
    else {
      instance.errorMessage = "";
    }
  }

  public validateTitle(name: string, instance: CreateValidation){
    if (name == "") {
      instance.errorMessage = "title is required";
    } 
    else if( name && (name.length > 50 || name.length < 3)){
      instance.errorMessage = "title should be more between 3 to 50"
    }
    else {
      instance.errorMessage = "";
    }
  }

  public validateDescription(name: string, instance: CreateValidation){
    if (name == "") {
      instance.errorMessage = "Description is required";
    } 
    else if( name && (name.length > 50 || name.length < 3)){
      instance.errorMessage = "Description should be more between 3 to 50"
    }
    else {
      instance.errorMessage = "";
    }
  }

  public validateProjectName(name: string, instance: CreateValidation){
    if(name == ""){
      instance.errorMessage = "Project Name is required";
    }
    else{
      instance.errorMessage = "";
    }
  }

  public validateProjectType(name: string, instance: CreateValidation){
      if(name == ""){
        instance.errorMessage = "Project Type is required";
      }
      else{
        instance.errorMessage = "";
      }
  }

  public validatePriority(name: string, instance: CreateValidation){
    if(name == ""){
      instance.errorMessage = "Priority is required";
    }
    else{
      instance.errorMessage = "";
    }
  }

 


  // /**
  //  *  Name field validation logic, min length 4 and max length 50
  //  * @param name {string} pass the name nbModel varibale
  //  * @param instance {CreateValidation} pass the created name Valication Instance
  //  * @param extraInstance {CreateValidation} pass the description validation instance to init it
  //  */

  // public validateName(
  //   name: string,
  //   instance: CreateValidation,
  //   extraInstance?: CreateValidation
  // ) {
  //   extraInstance.errorMessage = "";
  //   if (name == "") {
  //     instance.errorMessage = "Name is required";
  //   } else if (name && (name.length > 50 || name.length < 4)) {
  //     instance.errorMessage = "Name length should be between 4 to 50";
  //   } else {
  //     instance.errorMessage = "";
  //   }
  // }


  // /**
  //  * Desciption filed validation logic, max 200 required
  //  * @param name desciption ngModel varibale
  //  * @param instance desciption created instance
  //  */

  // public validateDesciption(name: string, instance: CreateValidation) {
  //   if (name.length > 200) {
  //     instance.errorMessage = "Desciption should be less then 200.";
  //   } else {
  //     instance.errorMessage = "";
  //   }
  // }

  // /**
  //  * Duration filed validation logic, min 10 required
  //  * @param name duration ngModel varibale
  //  * @param instance duration created instance
  //  */
  // public validateDuration(name: number, instance: CreateValidation) {
  //   if (name < 10) {
  //     instance.errorMessage = "Duration can't be less than 10";
  //   }
  //   else if (name >= 1240) {
  //     instance.errorMessage = "Duration must be less than 1240";
  //   }
  //   else {
  //     instance.errorMessage = "";
  //   }
  // }


  // /**
  // * Rtmp Url filed validation logic,
  // * @param name pushToChannels.rtmpStreamUrl ngModel varibale
  // * @param instance pushToChannels.rtmpStreamUrl created instance
  // */

  // public validateUrl(name: string, instance: CreateValidation) {
  //   if (!name.startsWith('rtmp://')) {
  //     instance.errorMessage = "Invalid rtmp url, should starts with rtmp://";
  //   }
  //   else if (!name.match(/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/)) {
  //     instance.errorMessage = 'Invalid rtmp url';
  //   }
  //   else if (name.length == 0 || name.length < 15) {
  //     instance.errorMessage = "Invalid rtmp url";
  //   }
  //   else {
  //     instance.errorMessage = "";
  //   }

  // }

  // /**
  // * Rtmp stream key filed validation logic,
  // * @param name pushToChannels.rtmpStreamKey ngModel varibale
  // * @param instance pushToChannels.rtmpStreamKey created instance
  // */
  // public validateKey(name: string, instance: CreateValidation) {
  //   if (name.length == 0 || name.length < 3) {
  //     instance.errorMessage = "Please enter Valid stream key";
  //   }
  //   else {
  //     instance.errorMessage = "";
  //   }
  // }

  // /**
  // * eventTime filed validation logic,
  // * @param name eventTime ngModel varibale
  // * @param instance eventType created instance
  // */
  // public validateTime(date: Date, time: string, instance: CreateValidation) {

  //   var date_ = new Date()
  //   if(date.getDate() !== date_.getDate()) return instance.errorMessage = "" /* if not todays date then skip the now time validation */

  //   var userHours: number = Number(time.split(':')[0])
  //   var userMintues: number = Number(time.split(':')[1])

  //   if (date_.getHours() === userHours){
  //     if (userMintues < date_.getMinutes()) return instance.errorMessage = "Time can't be less then current time." 
  //   } else {
  //     if (userHours < date_.getHours()) return instance.errorMessage = "Time can't be less then current time." 
  //   }
  //   instance.errorMessage = ""

  // }

  // public validateFolderName(
  //   name: string,
  //   instance: CreateValidation
  // ) {
  //   if (name == "") {
  //     instance.errorMessage = "Folder Name is required";
  //   } else if (name && (name.length > 20 || name.length < 3)) {
  //     instance.errorMessage = "folder Name length should be between 3 to 20";
  //   } else {
  //     instance.errorMessage = "";
  //   }
  // }


}
