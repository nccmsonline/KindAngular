import { Injectable, Inject } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { map } from 'rxjs/operators';
import { Indentpassing } from './indentpassing.model';

@Injectable({
  providedIn: 'root'
})
export class IndentpassingService {
  listIn:Indentpassing[];
  constructor(@Inject('BASE_URL') private original_url : string,private http:HttpClient) { }
  getIndentList(ServerIP, FYUSER,boid)
  {
    return this.http.get(this.original_url+"/indentandpo/rateapproval/getindentlist?serverip="+ServerIP+"&fyuser="+FYUSER+"&boid="+ boid).pipe(map((res : Indentpassing[])=>{
      console.log("res",res);
      return res;
    }));
  }
  getPassIndent(ServerIP, FYUSER,boid,  indentListToSave)
  {
    console.log("res","fsfdsfdsfd");
    return this.http.get(this.original_url+"/indentandpo/rateapproval/IndentConfirmation?serverip="+ServerIP+"&fyuser="+FYUSER+"&boid="+ boid +"&indentdetail="+JSON.stringify(indentListToSave)).pipe(map((res : Indentpassing[])=>{
      console.log("res",res);
      return res;
    }));
  }
  postPassedIndent(formData : Indentpassing[]){
    console.log("formData",formData);
    return this.http.post(this.original_url+'/test/IndentConfirmation',formData);
  }
}
