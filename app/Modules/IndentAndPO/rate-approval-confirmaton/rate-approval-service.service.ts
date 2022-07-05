import { Injectable, Inject } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class RateApprovalServiceService {

  constructor(@Inject('BASE_URL') private original_url : string, private http:HttpClient) { }
  getratapprovalforconfirmation(ServerIP, FYUSER,boid)
  {
    return this.http.get(this.original_url+"/indentandpo/rateapproval/getrateapprovalforconfirmation?serverip="+ServerIP+"&fyuser="+FYUSER+"&boid="+ boid).pipe(map((res : any[])=>{
      console.log("res",res);
      
      return res;
    }));
  }
  ConfirmationRateApproval(ServerIP, FYUSER,boid,  rateListToSave, confirm)
  {
   // console.log("res","http://localhost:44398/api/indentandpo/rateapproval/ConfirmRateApproval?serverip="+ServerIP+"&fyuser="+FYUSER+"&boid="+ boid +"&RateApprovalDetail="+JSON.stringify(rateListToSave)+"&confirm="+confirm);
    return this.http.get(this.original_url+"/indentandpo/rateapproval/ConfirmRateApproval?serverip="+ServerIP+"&fyuser="+FYUSER+"&boid="+ boid +"&RateApprovalDetail="+JSON.stringify(rateListToSave)+"&confirm="+confirm).pipe(map((res : any[])=>{
      console.log("res",res);
      
      return res;
    }));
  }
}
