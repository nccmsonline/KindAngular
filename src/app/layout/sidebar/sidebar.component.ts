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
  data: MenuItem[];
  userid:any;boid:any;
  branch1FinacialID: Subscription;
  parsedData:any
  public searchTerm = '';

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
         this.parsedData=menuList!=null?JSON.parse(menuList):[];
         this.data=this.parsedData
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
  public onkeyup(value: string): void {
    this.parsedData = this.search(this.data, value);
  }

  public search(items: any[], term: string): any[] {
    return items.reduce((acc, item) => {
          if (this.contains(item.label, term)) {
            acc.push(item);
          } else if (item.items && item.items.length > 0) {
            const newItems = this.search(item.items, term);

            if (newItems.length > 0) {
                  acc.push({ label: item.label, items: newItems });
            }
        }
          return acc;
      }, []);
  }

  public contains(label: string, term: string): boolean {
    return label.toLowerCase().indexOf(term.toLowerCase()) >= 0;
  }


  RountModel(url)
  {
    console.log("rounter click "+url);
  }
}
