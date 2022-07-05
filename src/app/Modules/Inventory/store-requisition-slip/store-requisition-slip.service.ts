import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class StoreRequisitionSlipService {

  original_url = environment.baseUrl;
  userinfo: any;
  branchinfo: any;
  coid: any;
  boid: any;
  fyid: any;
  branch1info: any;
  userid: any;
  useraccesstoken: any;
  FYUSER:any;ServerIP:any;
  token:any;WorkingDate:any;
  fstartdate:any;
  fenddate:any;
  isLoadingResults=false;
  Header: any;
  Detail: any;
  newData:any={};
  itemDisplay:any={};
  private onfieldArrayPush: BehaviorSubject<any> = new BehaviorSubject<any>('');
  public onDataChanged: Observable<any> = this.onfieldArrayPush.asObservable();

  constructor(private http: HttpClient, private router: Router,) { 
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

    
  getdepartment() {
    return this.http.get(this.original_url+"/MaterialManagement/Indents/getdepartment?coid="+this.coid+"&boid="+this.boid)
    .pipe(
      map((data: any[]) => {
        return data;
      })
   );
  }

  getcostcentre() {
    return this.http.get(this.original_url+"/MaterialManagement/Indents/getcostcentre?coid="+this.coid+"&boid="+this.boid)
    .pipe(
      map((data: any[]) => {
        return data;
      })
   );
  }

  getstore() {
    return this.http.get(this.original_url+"/MaterialManagement/requisition/getstore?coid="+this.coid+"&boid="+this.boid)
    .pipe(
      map((data: any[]) => {
        return data;
      })
   );
  }


  getbrandlist() {
    return this.http.get(this.original_url+"/MaterialManagement/Indents/getbrandlist?coid="+this.coid+"&boid="+this.boid)
    .pipe(
      map((data: any[]) => {
        return data;
      })
   );
  }

  getlastreqnno()
  {   
      let params = new HttpParams();
      params = params.append('coid', this.coid);
      params = params.append('boid', this.boid);
      params = params.append('fyid', this.fyid);
    
      return this.http.get(this.original_url+"/MaterialManagement/requisition/getlastreqnno", {params: params})
      .pipe(
        map((data: any[]) => {
          return data;
        })
     );
  }

  getitemlist(term, type) {
    return this.http.get(this.original_url+"/Masters/itemmaster/Getitemlist?PageNumber=1&PageSize=500&sort=&coid="+this.coid+"&boid="+this.boid+"&sortorder=&search="+term+"&fyid="+this.fyid+"&userid="+this.userid+"&token="+this.useraccesstoken+"&searchtype="+type)
    .pipe(
      map((data: any[]) => {
        return data;
      })
   );
  }

  savePushData(data)
  {
    this.onfieldArrayPush.next(data);
    console.log(data,"data0")
  }

 
}
