import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileUploaderService {

  constructor(private http: HttpClient) { }


  getpresignedurls(folder:String, fileName:String, fileType:String) {
    // console.log(fileName, fileType);

    // Remove special character and spaces
    fileName = fileName.replace(/[!@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?]+/g,"");
    fileName = fileName.replace(/\s/g, '');
    const timestamp = Date.now();
        const humanReadableDateTime = new Date(timestamp).toLocaleString();
        const mogiDT = humanReadableDateTime.replace(/[^0-9 ]/g,"a").replace(/ /g,"");
    fileName = mogiDT + "" + fileName;

    let getheaders = new HttpHeaders().set('Accept', 'application/json');
    return this.http.post<any>(environment.apiURL + 'file-upload/gcpStorageSignedURL',{
      "fileName": folder+'/'+fileName,
      "contentType":fileType
    }, { headers: getheaders });
  }

  uploadFile(folder:String, fileObj:File){
    return new Promise(resolve => {
      if (!fileObj) {

        return resolve("");
      }
      this.getpresignedurls(folder, fileObj.name, fileObj.type).subscribe(res => {
      // console.log("hree",res);
      if (res.status.code == 200) {
        const fileuploadurl = res.data.signedUrl;
        this.uploadFileByPut(fileuploadurl, fileObj.type, fileObj).subscribe((event) => {

          resolve(res.data.fileUrl);

        });
      }
    });
  });
  }

  uploadFileByPut(fileuploadurl:any, contentType:any, file:File) {

    const headers = new HttpHeaders({ 'Content-Type': contentType });
    const req = new HttpRequest(
      'PUT',
      fileuploadurl,
      file,
      {
        headers: headers,
      });
    return this.http.request(req);
  }
}
