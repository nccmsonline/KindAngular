import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PlatformLocation } from '@angular/common';
import { LoginService} from '../../Modules/General/login/login.service';
import { EmployeeProfileComponent } from '../../Modules/HR/employee-profile/employee-profile.component';
import { MatDialog } from '@angular/material';
import {MenuItem} from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import  {AddNewLoginComponent} from '../../Modules/General/login/add-new-login/add-new-login.component';
import  {ChangePassword} from '../../Modules/General/login/add-new-login/add-new-login.component';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  title = 'AsterisksInfo';
  currentPath: string;
  onLoginChanged: Subscription;
  AppUser:any={};
  CompanyName:any; pageShow: boolean = false;
  Address:any;IsAdmin:any;
  Address1:any;UserName:any;
  Address2:any;FinancialYearStartDate:any;FinancialYearEndDate:any;WorkingDate:any;
  userinfo: any;
  Branchinfo: any;
  LoginUser:any;
  companyData:any;
  userid:any;boid:any;
  branch1FinacialID: Subscription;
  sessionData: any;
  items: MenuItem[];
   table1:any;
  table2:any;
  branch1:any;
  branch2:any;
 menu:any={};
 link : Array<any>=[];
 ServerIP:any;

  constructor(
 
    platformLocation: PlatformLocation,
    private translate: TranslateService,
    private router: Router,
    private http: HttpClient,
    
    private loginService:LoginService,
    public dialog: MatDialog

  ) {
    translate.setDefaultLang('en');
    this.branch1FinacialID =
    this.loginService.branch1FinacialID
      .subscribe(res => {
      
        this.currentPath= sessionStorage.getItem("currentBranch");
        this.sessionData = JSON.parse(this.currentPath);
        if(this.sessionData)
        {
          this.ServerIP=this.sessionData['SERVERIP'];
          this.CompanyName = this.sessionData['COMPANYNAME'];
          this.Address = this.sessionData['ADDRESS'];
          this.Address1 = this.sessionData['ADDRESS1'];
          this.Address2 = this.sessionData['ADDRESS2'];
          this.FinancialYearStartDate = this.sessionData['FINANCIALYEARSTARTDATE'];
          this.FinancialYearEndDate = this.sessionData['FINANCIALYEARENDDATE'];
          this.WorkingDate = this.sessionData['WORKINGDATE'];
          this.boid = this.sessionData['BRANCHID'];
          let login = sessionStorage.getItem("currentUser");
          this.userinfo = JSON.parse(login);
          this.UserName = this.userinfo['USERNAME'];
          this.userid = this.userinfo['USERID'];
          this.LoginUser = this.userinfo['USERID'];
          this.IsAdmin= this.userinfo['ISADMIN'];
       
        }
      });  
  }

  ngOnInit() {
  }

  switchLanguage(language: string) {
    this.translate.use(language);
  }


  changeLogIn(){
    this.loginService.getBranchAndFyList( this.ServerIP).subscribe((response)=>{
      this.table1=response;
      this.table1=this.table1.Table;
      this.table2=response;
      this.table2=this.table2.Table1;
      const dialogRef = this.dialog.open(AddNewLoginComponent, {
        width: '600px',
        data: {
         branch:this.table1,
         branch1:this.table2,
         userid:this.userid
        }
        });
    });
  }
  ChangePassword(){

      const dialogRef = this.dialog.open(ChangePassword, {
        width: '600px',
        data: {  }
        });
  
  }
  openDialog(): void {
    let login = sessionStorage.getItem("currentUser");
    this.userinfo = JSON.parse(login);
    var empid= this.userinfo['EMPID'];
    console.log("empid",empid);
    const dialogRef = this.dialog.open(EmployeeProfileComponent, {
      data: {empid: empid}
    });
  }

  logoutClick()
  {
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('branch1');
    sessionStorage.removeItem('branch2');
    this.router.navigate(['/login']);
  }

}
