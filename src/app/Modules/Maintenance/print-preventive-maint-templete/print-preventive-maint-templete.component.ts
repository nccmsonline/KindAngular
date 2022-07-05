import { Global } from './../../../Global';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ExcelService } from 'src/app/services/excel/excel.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-print-preventive-maint-templete',
  templateUrl: './print-preventive-maint-templete.component.html',
  styleUrls: ['./print-preventive-maint-templete.component.css']
})
export class PrintPreventiveMaintTempleteComponent implements OnInit {

  HeaderData:any={};
  original_url = environment.baseUrl;
  onfieldArrayPush: Subscription;
  exportarray : Array<any> = [];
  userinfo : any;
  coid : any;
  isLoadingResults:boolean;
  boid : any;
  userID: any;
  branch1Data: any;
  branch2Data: any;
  fyid: any;
  Detail:  Array<any>=[];
  id:any;
  templeteid:any;
  machineid:any;
  companyname: any;
  unitname:any;
  unitemail:any;
  unitaddress:any;
  unitpan:any;
  unitgstno:any;
  unitphone:any;
  allDataGet: any;
  routeAction: any;
  contacts: Array<any> = [];
  
  constructor(
    private http: HttpClient,
    private globalVar: Global,
    private router: Router,
    private excelService: ExcelService,
    private activatedRoute: ActivatedRoute,private translate: TranslateService
  ) {
    this.unitname=this.globalVar.companyName;
    // this.id = this.activatedRoute.snapshot.paramMap.get('id');
    // let user = sessionStorage.getItem("currentUser");
    // this.userinfo = JSON.parse(user);
    // this.coid = this.globalVar.CommpanyId;
    // this.userID = this.userinfo['userid'];
    // let languageSet = sessionStorage.getItem("languageSet");
    // translate.setDefaultLang(languageSet);
    // let branch1 = sessionStorage.getItem("branch1");
    // this.branch1Data = JSON.parse(branch1);
    // this.boid = this.globalVar.BranchId;
    // // this.companyname = this.branch1Data['companyname'];
    // this.unitname = this.branch1Data['unitname'];
    this.unitgstno= this.globalVar.GSTIn;
    // this.unitpan= this.branch1Data['PAN'];
    this.unitaddress= this.globalVar.AddressOne;
    this.unitemail= this.globalVar.Puremail;
    this.unitphone= this.globalVar.telephone;
    // let branch2 = sessionStorage.getItem("branch2");
    // this.branch2Data = JSON.parse(branch2);
    // this.fyid = this.branch2Data['fyid'];     
    // this.excelService = excelService;
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    // this.routeAction = this.activatedRoute.snapshot.paramMap.get('action');

    // this.contacts=[
    //   {id:1,name:"Main Pillar / Bush",Remarks:"" ,togglereqd:true,status:"ok"},
    //   {id:2,name:"Semi Pillar / Bush",Remarks:"",togglereqd:true,status:"ok"},
    //   {id:3,name:"Centre Location / Pin",Remarks:"",togglereqd:true,status:"ok"},
    //   {id:4,name:"Grinding Sleeves",Remarks:"",togglereqd:true,status:"ok"},
    //   {id:5,name:"Alignment",Remarks:"",togglereqd:true,status:"ok"},
    //   {id:6,name:"Bolts",Remarks:"",togglereqd:true,status:"ok"},
    //   {id:7,name:"Top Plate",Remarks:"",togglereqd:true,status:"ok"},
    //   {id:8,name:"Bottom Plate",Remarks:"",togglereqd:true,status:"ok"},
    //   {id:9,name:"Dowelling",Remarks:"",togglereqd:true,status:"notok"},
    //   {id:10,name:"Die Thickness",Remarks:"",togglereqd:true,status:"notok"},
    //   {id:11,name:"Approx. Tool Life",Remarks:"",togglereqd:true,status:"ok"},
    //   {id:12,name:"RT Size",Remarks:"",togglereqd:false,status:"ok"},
    //   {id:13,name:"RT ID Bore Size",Remarks:"",togglereqd:false,status:"notok"},
    // ]
  
   
   }

  ngOnInit() {
    this.printtemplete(this.id);
  }

  // back() {
  //   if (this.routeAction == 'templete') { this.router.navigate(['/preventive-maint-template']); }
  //   else if (this.routeAction == 'maint') { this.router.navigate(['/maintenance-order']); }
  // }

  // print function. function options in index .html
  print() {
    window.print();
  }

  printtemplete(id) {
    
    this.http.get(this.original_url + "/Maintenance/DieMaint/getprintdiemaintdata?coid="+this.globalVar.CommpanyId+"&boid="+this.globalVar.BranchId+"&userid="+this.globalVar.UserId+"&id="+this.id)
      .subscribe((res) => {
        this.allDataGet = res;
        this.HeaderData = this.allDataGet.Table[0];
        this.Detail = this.allDataGet.Table1;
        // this.contacts.forEach(element => {
          this.Detail.forEach(i => {
          // if(element.id == i.CHECKPOINTID){

            // element.STVALUE=i.STVALUE;
            // element.OBSVALUE=i.OBSVALUE;
            if(i.STATUS=="true"){i.STATUS="Ok"}else{i.STATUS="Not Ok"};
            // element.REMARKS=i.REMARKS;
            console.log("contact",i)
          // }
            });
          // });
      });
  }
  
}
