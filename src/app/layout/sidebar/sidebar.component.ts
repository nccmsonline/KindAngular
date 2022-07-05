import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PlatformLocation } from '@angular/common';
import { LoginService} from '../../Modules/General/login/login.service';
import { EmployeeProfileComponent } from '../../Modules/HR/employee-profile/employee-profile.component';
import { MatDialog } from '@angular/material/dialog';
import {MenuItem} from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import  {AddNewLoginComponent} from '../../Modules/General/login/add-new-login/add-new-login.component';
import  {ChangePassword} from '../../Modules/General/login/add-new-login/add-new-login.component';
import { Global } from 'src/app/Global';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  currentPath: string;
  sessionData: any;
  userinfo: any;IsAdmin:any;
  items: MenuItem[];
  userid:any;boid:any;
  branch1FinacialID: Subscription;
  constructor(
    platformLocation: PlatformLocation,
    private translate: TranslateService,
    private router: Router,
    private http: HttpClient,
    public AppUser:Global,
    private loginService:LoginService,
    public dialog: MatDialog
  ) { 

    this.branch1FinacialID =
    this.loginService.branch1FinacialID
      .subscribe(res => {
      
        this.currentPath= sessionStorage.getItem("currentBranch");
        this.sessionData = JSON.parse(this.currentPath);
        if(this.sessionData)
        {
 
          this.boid = this.sessionData['BRANCHID'];
          let login = sessionStorage.getItem("currentUser");
          this.userinfo = JSON.parse(login);
          this.userid = this.userinfo['USERID'];
         
          this.IsAdmin= this.userinfo['ISADMIN'];
          let menuList = sessionStorage.getItem("menuList");
        //  this.items= JSON.parse(menuList);
          
        }
    
    // let datalist:any;
    // let mainmenulist:any;
    // let submainulist:any;
    //   this.loginService.getmenulist(this.userid,this.IsAdmin,this.boid)
    //   .subscribe((response) => {datalist=response;
    //           mainmenulist=response;
     
    //          this.items=mainmenulist;
    //           console.log("menu",response);
              
    //   });


    });  
   
  }

  ngOnInit() {  
  }
  RountModel(url)
  {
    console.log("rounter click "+url);
  }
}
