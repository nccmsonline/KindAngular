import { Global } from './../../../../../Global';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-queue-position',
  templateUrl: './queue-position.component.html',
  styleUrls: ['./queue-position.component.css']
})
export class QueuePositionComponent implements OnInit {

  action: string;
  newData: any = {};
  coid: any;
  boid: any;
  fyid: any;
  userid: any;
  userinfo: any;
  branch1Data: any;
  useraccesstoken: any;
  moArray = new MatTableDataSource<Maintenance>();
  branch2Data: any;
  original_url = environment.baseUrl;
  isLoadingResults=true;
  MAXQUEUENO:any;
  qno:any;
  displayedColumns: string[] = ['MOQUEUENO','MONO', 'MODATE','MTNO', 'MTDATE','DEPTNAME', 'MACHINENAME','TEAMNAME'];

  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<QueuePositionComponent>,
    private translate: TranslateService,
    private globalVar: Global,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    let languageSet = sessionStorage.getItem("languageSet");
    translate.setDefaultLang(languageSet);
    
    this.action = data.action;
    this.qno=data.qno;
    //this.queueno=data.queueno;
    let user = sessionStorage.getItem("currentUser");
    this.userinfo = JSON.parse(user);
    this.userid = this.userinfo['userid'];
    // this.coid = this.userinfo['coid'];
    // this.useraccesstoken = this.userinfo['useraccesstoken'];
    // let branch1 = sessionStorage.getItem("branch1");
    // this.branch1Data = JSON.parse(branch1);
    // this.boid = this.branch1Data['boid'];
    // let branch2 = sessionStorage.getItem("branch2");
    // this.branch2Data = JSON.parse(branch2);
    // this.fyid = this.branch2Data['fyid'];

    if (this.action == 'view') { 
      this.isLoadingResults = true;
      this.http.get(this.original_url+"/Maintenance/Ticket/commonapiticket?coid="+this.globalVar.CommpanyId+"&boid="+this.globalVar.BranchId+"&fyid="+this.globalVar.fyid)
        .subscribe((res) => {
          this.isLoadingResults = false;
          let allDataGet: any;
          allDataGet = res;
          this.moArray.data = allDataGet.Table11;
          this.MAXQUEUENO=allDataGet.Table10[0].MAXQUEUENO;
        });
    }
   }

  ngOnInit() {
  }

  setposition(data){
    let temparr1:Array<any>=[];
    let temparray:Array<any>=[];
    temparray=this.moArray.data;
    var MOQUEUENO= data.MOQUEUENO;
    if(MOQUEUENO==0 ||MOQUEUENO==null){
      MOQUEUENO=this.MAXQUEUENO + 1;
      this.moArray.data.forEach(element => {
        if(element.MOQUEUENO==MOQUEUENO){
          element.MOQUEUENO=MOQUEUENO+1;
        }
      });
    }
    else{
      var array:any;
        if(this.qno!=0 && this.qno !=undefined){
          if(this.qno!=data.MOQUEUENO){
            if(this.qno<data.MOQUEUENO){  //1<2

            }
            else if(this.qno>data.MOQUEUENO){ //2<1

            }
          }
        }
        else{
          //let q1,q2;
          //  temparr1= this.moArray.data.filter(a=>a.MOQUEUENO>0);
          //   q1=temparr1.filter(a=>a.MOQUEUENO<MOQUEUENO);
          //   q2=temparr1.filter(a=>a.MOQUEUENO>=MOQUEUENO);
          //   q2.forEach(element1 => {
          //     element1.MOQUEUENO=element1.MOQUEUENO+1;
          //     q1.push(element1);
          //   });          
          // temparr1=q1;
          // for(var i=0; i< temparr1.length;i++){
          //   this.moArray.data.find(a=>a.id==temparr1[i].id).MOQUEUENO=temparr1[i].MOQUEUENO;
          // }
        }
  

    }
    let moarr=this.moArray.data.filter(a=>a.MOQUEUENO>0);
   this.dialogRef.close({success: 'success', value: MOQUEUENO});
  }

}

export interface Maintenance{
  id:number;
  MTNO: string;
  dated: string;
  asset:string;
  MONO: string;
  MODATE: string;
  teamassigned:string;
  status:string;
  mostatus:string;
  mtstatus:string;
  MOQUEUENO:number;
}
export interface GithubApi {
  moArray: Maintenance[];
}