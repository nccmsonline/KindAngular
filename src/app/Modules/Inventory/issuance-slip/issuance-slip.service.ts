import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class IssuanceSlipService {

  original_url = environment.baseUrl;
  userinfo: any;
  boid :any;
  branch1info: any;
  FYUSER:any;ServerIP:any;
  userid:any;token:any;WorkingDate:any;
  fstartdate:any;
  fenddate:any;
  
  constructor(
    private http: HttpClient
  ) {
    let currentBranch = sessionStorage.getItem("currentBranch");
    var CompanyData = JSON.parse(currentBranch);
    this.ServerIP=CompanyData['SERVERIP'];
    this.FYUSER=CompanyData['FYUSER'];
    this.boid = CompanyData['BRANCHID'];
    this.fstartdate=  formatDate(CompanyData['FINANCIALYEARSTARTDATE'], 'dd-MMM-yyyy', 'en-US', '+0530'); 
    this.fenddate=  formatDate(CompanyData['FINANCIALYEARENDDATE'], 'dd-MMM-yyyy', 'en-US', '+0530'); 
    let currentUser = sessionStorage.getItem("currentUser");
    currentUser = JSON.parse(currentUser);
    this.userid = currentUser['USERID'];
    this.token = currentUser['TOKEN'];
    this.WorkingDate= new Date(CompanyData['WORKINGDATE']);
   }

  getPendingreq() {
    return this.http.get(this.original_url+"/MaterialManagement/issuance/getpendingreqn?boid="+this.boid)
    .pipe(
      map((data: any[]) => {
        return data;
      })
   );
  }
  commonApi() {
  //   console.log("fyid",this.fyid);
  //   return this.http.get(this.original_url+"/MaterialManagement/issuance/getlastissuanceno?coid="+this.coid+"&boid="+this.boid+"&fyid="+this.fyid)
  //   .pipe(
  //     map((data: any[]) => {
  //       return data;
  //     })
  //  );
  }
  getRequisitiondata(id) {
    return this.http.get(this.original_url+"/MaterialManagement/requisition/getrequisitiondata?boid="+this.boid+"&reqnid="+id+"&forreqn=n")
    .pipe(
      map((data: any[]) => {
        return data;
      })
   );
  }

  savePushData(data)
  {
    //this.onfieldArrayPush.next(data);
    console.log(data,"data0")
  }
}
