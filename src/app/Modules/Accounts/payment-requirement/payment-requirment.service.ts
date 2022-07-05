import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { formatDate } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class PaymentRequirmentService {
  original_url = environment.baseUrl;
  userinfo: any;
  coid: any;
  boid: any;
  branch2info: any;
  fyid: any;
  fysdate: any;
  fyedate: any;
  branch1Data: any;
  useraccesstoken: any;
  userid: any;
  token:any;
  workingDate:any;

  private onfieldArrayPush: BehaviorSubject<any> = new BehaviorSubject<any>('');
  public onDataChanged: Observable<any> = this.onfieldArrayPush.asObservable();

  constructor(private http: HttpClient
    ) {
      let currentBranch = sessionStorage.getItem("currentBranch");
      var CompanyData = JSON.parse(currentBranch);
      this.workingDate= new Date (CompanyData['WORKINGDATE']) ;
      let currentUser = sessionStorage.getItem("currentUser");
      currentUser = JSON.parse(currentUser);
      this.token = currentUser['TOKEN'];
      this.fysdate = formatDate(CompanyData['FINANCIALYEARSTARTDATE'], 'dd-MMM-yyyy', 'en-US');
      this.fyedate =formatDate( CompanyData['WORKINGDATE'], 'dd-MMM-yyyy', 'en-US');
  }
  SupplierList(term) {
     return this.http.get(this.original_url+"/Master/getAccountList?token="+this.token+"&search="+term)
    .pipe(
      map((data: any[]) => {
        return data;
      })
   );
  }
 
  StatementOfAccounts(term) {
  return this.http.get(this.original_url+"/Accounts/Accounts/getAccountStatements?fromDate="+this.fysdate+"&toDate="+this.fyedate+"&accountids="+term+"&userid="+this.userid+"&token="+this.token).pipe(map((res : any[])=>{
  
    return res;
  }));
  }
  getSupplierBankList(accountid) {
    return this.http.get(this.original_url+"/Master/getSupplierBankerList?accountid="+accountid+ "&token="+this.token)
    .pipe(
      map((data: any[]) => {
        return data;
      })
   );
  }
  getRequirementDetail(id, PartyAcId) {
    return this.http.get(this.original_url+"/Accounts/payments/getPayRequirementDetail?reqid="+id+"&accountid="+PartyAcId+"&token="+ this.token)
    .pipe(
      map((data: any[]) => {
        return data;
      })
   );
  }
  getPendingBills(id) {
    return this.http.get(this.original_url+"/Accounts/payments/getPendingBills?accountid="+id+"&token="+ this.token)
    .pipe(
      map((data: any[]) => {
        return data;
      })
   );
  }
  
}
