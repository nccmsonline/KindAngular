import { Injectable, Inject } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class RateApprovalServiceService {
  userid:any;token:any; 
  constructor(@Inject('BASE_URL') private original_url : string, private http:HttpClient) {
    let currentUser = sessionStorage.getItem("currentUser");
currentUser = JSON.parse(currentUser);

this.token = currentUser['TOKEN'];
this.userid = currentUser['USERID'];
   }
  getratapprovalforconfirmation(ServerIP, FYUSER,boid)
  {
    return this.http.get(this.original_url+"/indentandpo/rateapproval/getrateapprovalforconfirmation?token="+this.token).pipe(map((res : any[])=>{
      console.log("res",res);
      
      return res;
    }));
  }
  ConfirmationRateApproval(ServerIP, FYUSER,boid,  rateListToSave, confirm)
  {
   // console.log("res","http://localhost:44398/api/indentandpo/rateapproval/ConfirmRateApproval?serverip="+ServerIP+"&fyuser="+FYUSER+"&boid="+ boid +"&RateApprovalDetail="+JSON.stringify(rateListToSave)+"&confirm="+confirm);
    return this.http.get(this.original_url+"/indentandpo/rateapproval/ConfirmRateApproval?RateApprovalDetail="+JSON.stringify(rateListToSave)+"&confirm="+confirm+"&token="+this.token).pipe(map((res : any[])=>{
      console.log("res",res);
      
      return res;
    }));
  }
}
