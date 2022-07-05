import { Injectable,Inject } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class PaymentConfirmationService {
  original_url=environment.baseUrl;
  userid:any;token:any; 
  constructor(private http:HttpClient) { 

    let currentUser = sessionStorage.getItem("currentUser");
    currentUser = JSON.parse(currentUser);
  
  this.token = currentUser['TOKEN'];
  this.userid = currentUser['USERID'];
  }
  getPaymentListForConfirmation(ServerIP, FYUSER,boid, confirm)
  {
    console.log("BASE_URL",this.original_url);
    return this.http.get(this.original_url+ "/Accounts/Payments/getPaymentListForConfirmation?Confirmed="+confirm+"&userid="+this.userid+"&token="+this.token).pipe(map((res )=>{
      console.log("res",res);
      
      return res;
    }));
  }
  
  PaymentConfirmation(ServerIP, FYUSER,boid,  paymentList, flag)
  {
   // return this.http.get(this.original_url+"/Accounts/Payments/PaymentConfirmation?serverip="+ServerIP+"&fyuser="+FYUSER+"&boid="+ boid +"&PaymentDetail="+JSON.stringify(paymentList)+"&flag="+flag).pipe(map((res : any[])=>{
    console.log("PaymentDetail",paymentList);
    return this.http.get(this.original_url+"/Accounts/Payments/PaymentConfirmation?PaymentDetail="+JSON.stringify(paymentList)+"&flag="+flag+"&userid="+this.userid+"&token="+this.token).pipe(map((res)=>{
      console.log("res",res);
      
      return res;
    }));
  }
}
