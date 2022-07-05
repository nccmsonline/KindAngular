// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, ParamMap, Router, NavigationEnd } from '@angular/router';
// import { PlatformLocation } from '@angular/common';
// import { TranslateService } from '@ngx-translate/core';
// import { HttpClient } from '@angular/common/http';
// import { Subscription } from 'rxjs';
// import { map } from 'rxjs/operators';
// import { LoginService} from './Modules/General/login/login.service';
// import { EmployeeProfileComponent } from './Modules/HR/employee-profile/employee-profile.component';
// import { MatDialog } from '@angular/material';
// import {MenuItem} from 'primeng/api';
// import  {AddNewLoginComponent} from './Modules/General/login/add-new-login/add-new-login.component';
// import  {ChangePassword} from './Modules/General/login/add-new-login/add-new-login.component';
// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.css']
// })
// export class AppComponent {
//   title = 'AsterisksInfo';
//   currentPath: string;
//   onLoginChanged: Subscription;
//   AppUser:any={};
//   CompanyName:any; pageShow: boolean = false;
//   Address:any;IsAdmin:any;
//   Address1:any;UserName:any;
//   Address2:any;FinancialYearStartDate:any;FinancialYearEndDate:any;WorkingDate:any;
//   userinfo: any;
//   Branchinfo: any;
//   LoginUser:any;
//   companyData:any;
//   userid:any;boid:any;
//   branch1FinacialID: Subscription;
//   sessionData: any;
//   items: MenuItem[];
//    table1:any;
//   table2:any;
//   branch1:any;
//   branch2:any;
//  menu:any={};
//  link : Array<any>=[];
//  ServerIP:any;
//   constructor(
   
//     platformLocation: PlatformLocation,
//     private translate: TranslateService,
//     private router: Router,
//     private http: HttpClient,
    
//     private loginService:LoginService,
//     public dialog: MatDialog
//   ) {
//     translate.setDefaultLang('en');
//     this.branch1FinacialID =
//     this.loginService.branch1FinacialID
//       .subscribe(res => {
      
//         this.currentPath= sessionStorage.getItem("currentBranch");
//         this.sessionData = JSON.parse(this.currentPath);
//         if(this.sessionData)
//         {
//           this.ServerIP=this.sessionData['SERVERIP'];
//           this.CompanyName = this.sessionData['COMPANYNAME'];
//           this.Address = this.sessionData['ADDRESS'];
//           this.Address1 = this.sessionData['ADDRESS1'];
//           this.Address2 = this.sessionData['ADDRESS2'];
//           this.FinancialYearStartDate = this.sessionData['FINANCIALYEARSTARTDATE'];
//           this.FinancialYearEndDate = this.sessionData['FINANCIALYEARENDDATE'];
//           this.WorkingDate = this.sessionData['WORKINGDATE'];
//           this.boid = this.sessionData['BRANCHID'];
//           let login = sessionStorage.getItem("currentUser");
//           this.userinfo = JSON.parse(login);
//           this.UserName = this.userinfo['USERNAME'];
//           this.userid = this.userinfo['USERID'];
//           this.LoginUser = this.userinfo['USERID'];
//           this.IsAdmin= this.userinfo['ISADMIN'];
//           let datalist:any;
//           let mainmenulist:any;
//           let submainulist:any;
//             this.loginService.getmenulist(this.userid,this.IsAdmin,this.boid)
//             .subscribe((response) => {datalist=response;
//                     mainmenulist=response;
//                     mainmenulist=mainmenulist.Table;
                
//                     submainulist=response;
//                     this.items=submainulist;

//             });
//         }
//       });   
//   }

//   ngOnInit() {
//     this.router.events
//       .subscribe((event) => {
//         if (event instanceof NavigationEnd) {
//           this.pageShow = false;
//           if(event.url == '/login')
//           {
//             this.pageShow = true;
//           }
//         }
//       });
      
//   }
//   changeLogIn(){
//     this.loginService.getBranchAndFyList( this.ServerIP).subscribe((response)=>{
//       this.table1=response;
//       this.table1=this.table1.Table;
//       this.table2=response;
//       this.table2=this.table2.Table1;
//       const dialogRef = this.dialog.open(AddNewLoginComponent, {
//         width: '600px',
//         data: {
//          branch:this.table1,
//          branch1:this.table2,
//          userid:this.userid
//         }
//         });
//     });
//   }
//   ChangePassword(){

//       const dialogRef = this.dialog.open(ChangePassword, {
//         width: '600px',
//         data: {  }
//         });
  
//   }
//   openDialog(): void {
//     let login = sessionStorage.getItem("currentUser");
//     this.userinfo = JSON.parse(login);
//     var empid= this.userinfo['EMPID'];
//     console.log("empid",empid);
//     const dialogRef = this.dialog.open(EmployeeProfileComponent, {
//       data: {empid: empid}
//     });
//   }
//   switchLanguage(language: string) {
//     this.translate.use(language);
//   }

//   logoutClick()
//   {
//     sessionStorage.removeItem('currentUser');
//     sessionStorage.removeItem('currentBranch');
//     this.router.navigate(['/login']);
//     this.items=[];
//   }
 
// }

import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
// import { SignalRService } from './services/signal-r.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Subscription, interval } from 'rxjs';
import { environment } from '../environments/environment';
import { SuccessDialogComponent } from './Dialog/success-dialog/success-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private signalRSubscription: Subscription;
  original_url=environment.baseUrl;
  public content: Message;
  data:any;
  updateSubscription:any;
  boid : any;FYUSER:any;ServerIP:any;token:any;userid:any;
  constructor(
    private router: Router,
    public dialog: MatDialog,
    private http: HttpClient,
   // private signalrService: SignalRService,
    private translate: TranslateService,
  ) {


     translate.setDefaultLang('en');
    // this.signalRSubscription = this.signalrService.getMessage().subscribe(
    //   (message) => {
    //     // this.getLoginData();
    //     this.content = message;
    //    //console.log("Manoj msg", message);
    // });

   // this.signalrService.commonFunction();

      this.updateSubscription = interval(10000).subscribe(
        (val) => { 
          this.getLoginData();
      });
    
  }

  ngOnInit() {
   

  }
  getLoginData()
  {
    let currentBranch = sessionStorage.getItem("currentBranch");
   // console.log("currentBranch", currentBranch);
    if(currentBranch!=null)
    {
      var CompanyData = JSON.parse(currentBranch);
      this.ServerIP=CompanyData['SERVERIP'];
      this.FYUSER=CompanyData['FYUSER'];
      this.boid = CompanyData['BRANCHID'];
      
      let currentUser = sessionStorage.getItem("currentUser");
      currentUser = JSON.parse(currentUser);
      this.userid = currentUser['USERID'];
      this.token = currentUser['TOKEN'];
  
      const  params = new  HttpParams()
      .set('fyuser', this.FYUSER)
      .set('serverip', this.ServerIP)
      .set('token', this.token)
      .set('userid', this.userid);
      this.http.get(this.original_url+"/user/getSessionDetail?"+ params.toString())
      .subscribe((res) => {
        this.data=res;
     console.log("my session detail",res);
        if (this.data=="loginfailed")
        { 
          const dialogRef = this.dialog.open(SuccessDialogComponent, {
            data: {
              wrongData: 'wrongData',
              displayMsg:'Session out, please Login again.'
            }
          });
          this.logoutClick();
        }
      });
    }
  
    
  }
  ngOnDestroy(): void {
    // this.signalrService.disconnect();
    this.signalRSubscription.unsubscribe();
  }
  
  logoutClick()
  {
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('branch1');
    sessionStorage.removeItem('branch2');
    sessionStorage.removeItem('currentBranch');
    this.dialog.closeAll();
    this.router.navigate(['/login'], { skipLocationChange: true });
  }
}

export interface Message {
  val1: string;
  val2: string;
  val3: string;
  val4: string;
}