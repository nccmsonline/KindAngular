import { Injectable, Inject } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { map } from 'rxjs/operators';
import { Indentpassing } from './indentpassing.model';
import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class IndentpassingService {
  original_url=environment.baseUrl;
  listIn:Indentpassing[];userid:any;token:any; 
  constructor(private http:HttpClient) { 
    
      let currentUser = sessionStorage.getItem("currentUser");
      currentUser = JSON.parse(currentUser);

      this.token = currentUser['TOKEN'];
      this.userid = currentUser['USERID'];
  }
  getIndentList(ServerIP, FYUSER,boid)
  {
    return this.http.get(this.original_url+"/indentandpo/rateapproval/getindentlist?serverip="+ServerIP+"&fyuser="+FYUSER+"&boid="+ boid+"&userid="+this.userid+"&token="+this.token).pipe(map((res : Indentpassing[])=>{
      console.log("res",res);
      return res;
    }));
  }
  getPassIndent(ServerIP, FYUSER,boid,  indentListToSave)
  {
    console.log("res","fsfdsfdsfd");
    return this.http.get(this.original_url+"/indentandpo/rateapproval/IndentConfirmation?serverip="+ServerIP+"&fyuser="+FYUSER+"&boid="+ boid +"&indentdetail="+JSON.stringify(indentListToSave)+"&userid="+this.userid+"&token="+this.token).pipe(map((res : Indentpassing[])=>{
      console.log("res",res);
      return res;
    }));
  }
  postPassedIndent(formData : Indentpassing[]){
    console.log("formData",formData);
    return this.http.post(this.original_url+'/test/IndentConfirmation',formData);
  }
}
