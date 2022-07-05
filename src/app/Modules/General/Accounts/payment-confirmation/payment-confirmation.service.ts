import { Injectable,Inject } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class PaymentConfirmationService {

  constructor(private http:HttpClient,@Inject('BASE_URL') private original_url : string) { }
  getPaymentListForConfirmation(ServerIP, FYUSER,boid, confirm)
  {
    console.log("BASE_URL",this.original_url);
    return this.http.get(this.original_url+ "/Accounts/Payments/getPaymentListForConfirmation?serverip="+ServerIP+"&fyuser="+FYUSER+"&boid="+ boid+"&Confirmed="+confirm).pipe(map((res : any[])=>{
      console.log("res",res);
      
      return res;
    }));
  }
  PaymentConfirmation(ServerIP, FYUSER,boid,  paymentList, flag)
  {
   // return this.http.get(this.original_url+"/Accounts/Payments/PaymentConfirmation?serverip="+ServerIP+"&fyuser="+FYUSER+"&boid="+ boid +"&PaymentDetail="+JSON.stringify(paymentList)+"&flag="+flag).pipe(map((res : any[])=>{
    console.log("PaymentDetail",paymentList);
    return this.http.get(this.original_url+"/Accounts/Payments/PaymentConfirmation?serverip="+ServerIP+"&fyuser="+FYUSER+"&boid="+ boid +"&PaymentDetail="+JSON.stringify(paymentList)+"&flag="+flag).pipe(map((res : any[])=>{
      console.log("res",res);
      
      return res;
    }));
  }
}
