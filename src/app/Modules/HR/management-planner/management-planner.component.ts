import { Global } from '../../../Global';
import { ReminderPopupComponent } from './reminder-popup/reminder-popup.component';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Group } from '@progress/kendo-drawing';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http'
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-management-planner',
  templateUrl: './management-planner.component.html',
  styleUrls: ['./management-planner.component.css']
})
export class ManagementPlannerComponent implements OnInit {
  alldata: any;
  divarray: Array<any> = [];
  isLoadingResults: boolean = false;
  public progress: number;
  public message: string;

  constructor(
    private http: HttpClient,
    private translate: TranslateService,
    private router: Router,
    public dialog: MatDialog,
    private globalVar: Global
  ) {
    this.isLoadingResults = true;
    let languageSet = sessionStorage.getItem("languageSet");
    translate.setDefaultLang(languageSet);
    this.http.get("http://kindwebapi.suvidhacloud.com/api/Masters/CommonMaster/getmanagementgroups?isactive=1&boid="+this.globalVar.BranchId)
      .subscribe((data: any[]) => {
        this.isLoadingResults = false;
        this.alldata = data
        //this.alldata=this.alldata.Table;
        this.divarray = this.alldata.Table;
      });
  }

  ngOnInit() {
  }

  addnew(event, id, group) {
    this.router.navigate(['/add-Management-planner/' + id]);
  }

  reminderOpen(id) {
    console.log("id", id)
    const dialogRef = this.dialog.open(ReminderPopupComponent, {
      data: {
        id: id,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      
      console.log("result", result)
      if (result!= null && result != undefined && result != '') {
        console.log("id2", result.id)
        if (result.id != null && result.id != undefined && result.id != '') {
          this.router.navigate(['/management-planner/']);
          setTimeout(() => {
            this.addnew('event', result.id, result.name)
          }, 1000);
          
          
        }
      } else {
        this.router.navigate(['/management-planner/']);
      }
    });
  }




  // upload(files) {
  //   if (files.length === 0)
  //     return;

  //   const formData = new FormData();

  //   for (let file of files)
  //     formData.append(file.name, file);

  //   const uploadReq = new HttpRequest('POST', `https://localhost:44317/api/Quote/Marketing/UploadFile?module='marketing&form='quote''`, formData, {
  //     reportProgress: true,
  //   });

  //   this.http.request(uploadReq).subscribe(event => {
  //     if (event.type === HttpEventType.UploadProgress)
  //       this.progress = Math.round(100 * event.loaded / event.total);
  //     else if (event.type === HttpEventType.Response)
  //       this.message = event.body.toString();
  //   });
  // }

}

