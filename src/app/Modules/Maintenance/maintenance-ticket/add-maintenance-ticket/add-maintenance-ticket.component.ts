import { Global } from '../../../../Global';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient, HttpRequest, HttpEventType, HttpParams } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { from } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../../environments/environment';
import { ValidationComponent } from 'src/app/validation/validation.component';
import { SuccessDialogComponent } from 'src/app/Dialog/success-dialog/success-dialog.component';

@Component({
  selector: 'app-add-maintenance-ticket',
  templateUrl: './add-maintenance-ticket.component.html',
  styleUrls: ['./add-maintenance-ticket.component.css']
})
export class AddMaintenanceTicketComponent implements OnInit {
  // coid: any;
  // boid: any;
  // fyid: any;
  // userid: any;
  // userinfo: any;
  // branch1Data: any;
  // branch2Data: any;
  isLoadingResults = false;
  showuploadbtn = false;
  original_url = environment.baseUrl;
  images_url = environment.imageUrl;
  MaintenanceForm: FormGroup;
  routeID: any;
  routeAction: any;
  MTNO: any;
  formData = new FormData();
  public progress: number;
  public message: string;
  osservertype: any;
  deptDDArray: Array<any> = [];
  employeeDDArray: Array<any> = [];
  mccatgDDArray: Array<any> = [];
  mcmstDDArray: Array<any> = [];
  newData: any = {};
  priorityDDArray: Array<any> = [];
  date = new Date();
  showcustmachine = false;
  arrayItemCustomer = '';
  mccatgid: any;
  MTDEPTID: any;
  fystartdate: any;
  fyenddate: any;
  lastmoDate: any;
  isLoading: boolean;
  allDataGet: any;
  photosBuffer: Array<any> = [];


  constructor(
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private translate: TranslateService,
    private http: HttpClient,
    private router: Router,
    private globalVar: Global
    // private service: MaintenceTicketService
  ) {
    let languageSet = sessionStorage.getItem("languageSet");
    translate.setDefaultLang(languageSet);

    // let user = sessionStorage.getItem("currentUser");
    // this.userinfo = JSON.parse(user);
    // this.userid = this.userinfo['userid'];
    // this.coid = this.userinfo['coid'];

    // let branch1 = sessionStorage.getItem("branch1");
    // this.branch1Data = JSON.parse(branch1);
    // this.osservertype = this.branch1Data['osservertype'];
    // this.boid = this.branch1Data['boid'];
    // let branch2 = sessionStorage.getItem("branch2");
    // this.branch2Data = JSON.parse(branch2);
    // this.fyid = this.branch2Data['fyid'];
    // this.fystartdate = this.branch2Data['fystartdate'];
    // this.fyenddate = this.branch2Data['fyenddate'];

    this.routeID = this.activatedRoute.snapshot.paramMap.get('id');
    this.routeAction = this.activatedRoute.snapshot.paramMap.get('action');
    this.createForm();

    if (this.routeAction == "new") {
      this.isLoadingResults = true;
      this.http.get(this.original_url + "/Maintenance/Ticket/commonapiticket?coid=" + this.globalVar.CommpanyId + "&boid=" + this.globalVar.BranchId + "&fyid=" + this.globalVar.fyid)
        .subscribe((res) => {
          let allDataGet: any;
          allDataGet = res;
          this.MTNO = allDataGet.Table[0].MTNO;
          this.deptDDArray = allDataGet.Table7;
          this.employeeDDArray = allDataGet.Table6;
          this.mccatgDDArray = allDataGet.Table1;
          this.mcmstDDArray = allDataGet.Table2;
          this.priorityDDArray = allDataGet.Table8;
          this.isLoadingResults = false;
          this.newData.MTTYPE = "P";
          this.newData.MTCATG = "M";
          this.newData.MTDATE = this.date;
          this.lastmoDate = allDataGet.Table13[0].lastticketdate;

        });
    }
    else if (this.routeAction == "edit" || this.routeAction == "view" || this.routeAction == "mchistory" || this.routeAction == "mtregister" || this.routeAction == "moregister" || this.routeAction == "orderlist") {
      this.isLoadingResults = true;
      this.http.get(this.original_url+"/Maintenance/Ticket/getticketdata?coid="+this.globalVar.CommpanyId+"&boid="+this.globalVar.BranchId+"&id="+this.routeID)
        .subscribe((response) => {
          this.isLoadingResults = false;
          var allDataGet: any;
          allDataGet = response;
         
          this.newData.MTTIME = new Date("Wed, 27 July 2016 " + this.newData.MTTIME);
          this.newData.MTDUETIME = new Date("Wed, 27 July 2016 " + this.newData.MTDUETIME);
          this.deptDDArray = allDataGet.Table4;
          this.employeeDDArray = allDataGet.Table7;
          this.mccatgDDArray = allDataGet.Table2;
          this.mcmstDDArray = allDataGet.Table13;
          this.priorityDDArray = allDataGet.Table9;
          this.newData = allDataGet.Table[0];
          this.MTNO = this.newData.MTNO;
          if (this.newData.MTDOCUPLOADED == true) {
            this.showuploadbtn = true;
          }
        });
    }
    else if (this.routeAction == "generate") {
      this.isLoadingResults = true;
      this.http.get(this.original_url + "/Maintenance/Ticket/commonapiticket?coid=" + this.globalVar.CommpanyId + "&boid=" + this.globalVar.BranchId + "&fyid=" + this.globalVar.fyid)
        .subscribe((res) => {
          this.isLoadingResults = false;
          let allDataGet: any;
          allDataGet = res;
          this.MTNO = allDataGet.Table[0].MTNO;
          this.deptDDArray = allDataGet.Table7;
          this.employeeDDArray = allDataGet.Table6;
          this.mccatgDDArray = allDataGet.Table1;
          this.mcmstDDArray = allDataGet.Table2;
          this.priorityDDArray = allDataGet.Table8;
          this.newData.MTTYPE = "P";
          this.newData.problemtype = "M";
        });
      this.http.get(this.original_url+"/Maintenance/Ticket/getticketdata?coid="+this.globalVar.CommpanyId+"&boid="+this.globalVar.BranchId+"&id="+this.routeID)
        .subscribe((response) => {
          this.isLoadingResults = false;
          var allDataGet: any;
          allDataGet = response;
          allDataGet == allDataGet.Table[0];
          this.newData.mccatgid = allDataGet.MCCatgId;
          this.newData.MCCatgName = allDataGet.MCCatgName;
          this.newData.MTASSETID = allDataGet.id;
          this.newData.MachineName = allDataGet.MachineName;
          this.newData.LastMaint = allDataGet.LastMaint;
          this.newData.NextMaint = allDataGet.NextMaint;
        });
    }
  }

  createForm() {
    this.MaintenanceForm = this.fb.group({

    })
  }
  searchTermCustomer(event) {
    let term: any;
    term = event;
    this.arrayItemCustomer = term;
    if (this.arrayItemCustomer !== '') {
      this.isLoading = true;
      this.http.get(this.original_url + "/Masters/CommonMaster/Getcustomersupplierlist?PageNumber=1&PageSize=100coid=" + this.globalVar.CommpanyId + "&boid=" + this.globalVar.BranchId + "&search=" + this.arrayItemCustomer + "&type=C")
        .subscribe((respose) => {
          this.isLoading = false;
          this.allDataGet = respose;
          this.allDataGet = this.allDataGet.Table;
          this.photosBuffer = this.allDataGet;
        }, error => {
          this.isLoadingResults = false;
        }
        );
    }
    else {
      this.isLoading = false;
      this.photosBuffer = [];
      this.arrayItemCustomer = '';
    }
  }

  reset(data) {
    this.arrayItemCustomer = '';
    data.customername = '';
    data.customerid = '';
    this.onChangeOfItemCodeCustomer(null, null);
  }

  onChangeOfItemCodeCustomer(data, rowDetail) {
    if (data == null) {

      this.newData.customerid = '';
      this.newData.customername = '';

    }
    else {

      this.newData.customerid = data.CUSTOMERID;
      this.newData.customername = data.NAME;
      this.arrayItemCustomer = '';

    }
  }

  dropdownHide() {
    this.arrayItemCustomer = '';
  }

  ngOnInit() {
  }

  selectdept(event) {
    if (event.length == 0) {
      this.MTDEPTID = '';
    }
    else {
      this.MTDEPTID = event[0];
      this.MTDEPTID = this.MTDEPTID.data;
      this.MTDEPTID = this.MTDEPTID.id;
      // this.service.getemployeeListbydept(this.MTDEPTID)
      //   .subscribe((response) => {
      //     this.isLoadingResults = false;
      //     let allDataGet;
      //     allDataGet = response;
      //     this.employeeDDArray = allDataGet.Table;
      //   });
    }
  }

  selectmccatg(event) {
    if (event.length == 0) {
      this.mccatgid = '';
      this.newData.MTASSETID = '';
    }
    else {
      this.mccatgid = event[0];
      this.mccatgid = this.mccatgid.data;
      this.mccatgid = this.mccatgid.id;
      // this.service.getmachinesListbycatg(this.mccatgid)
      //   .subscribe((response) => {
      //     this.isLoadingResults = false;
      //     let allDataGet;
      //     allDataGet = response;
      //     this.mcmstDDArray = allDataGet.Table;
      //   });
    }
  }

  selectmcname(type) {

  }

  back() {
    if (this.routeAction == 'edit' || this.routeAction == 'view' || this.routeAction == 'new') { this.router.navigate(['/maintenance-ticket']); }
    else if (this.routeAction == 'mchistory') { this.router.navigate(['/machine-history']); }
    else if (this.routeAction == 'orderlist') { this.router.navigate(['/maintenance-order']); }
    else if (this.routeAction == 'mtregister') { this.router.navigate(['/maintenance-reports/print-maint-report/mt-register']); }
    else if (this.routeAction == 'moregister') { this.router.navigate(['/maintenance-reports/print-maint-report/mo-register']); }
  }

  changeproblemtype(event) {
    if (event.value == "C") {
      this.showcustmachine = true;
    }
    else {
      this.showcustmachine = false;
    }
  }



  // statuspopup() {
  //   const dialogRef = this.dialog.open(MaintenacestatusComponent, {
  //     data: {
  //       action: 'view',
  //       id: this.routeID
  //     }
  //   });
  // }



  selectuser(type) {

  }

  changetype(event) {

  }

  upload(files) {
    var imgURL: any;
    if (files.length === 0)
      return;
    var reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      imgURL = reader.result;
      for (let file of files) {
        this.formData.append(file.name, file);
      }
    }
  }

  Isdocumentclick(event) {
    if (event.checked == true) {
      this.showuploadbtn = true;
    }
    else {
      this.showuploadbtn = false;
    }
  }

  validateBeforeSave(hdata, action) {
    var flag: boolean;
    flag = true;
    var msg: any;
    msg = "<h5>Please rectify the following before Saving Data:-</h5>";
    if (hdata.MTDATE == undefined || hdata.MTDATE == '' || hdata.MTDATE == null) { flag = false; msg = msg + "* Please select a valid date <br/>" }
    // if (hdata.TICKETSTATUS == undefined || hdata.TICKETSTATUS == '' || hdata.TICKETSTATUS == null) { flag = false; msg = msg + "* Please select Ticket status <br/>" }
    if (hdata.MTDEPTID == null || hdata.MTDEPTID == undefined || hdata.MTDEPTID == '') { flag = false; msg = msg + "* Please Select Department <br/>" }
    if (hdata.MTTEMPID == null || hdata.MTTEMPID == undefined || hdata.MTTEMPID == '') { flag = false; msg = msg + "* Please Select Employee <br/>" }
    if ((hdata.MTTYPE == "M" || hdata.MTTYPE == "G") && (hdata.MCCATGID == '' || hdata.MCCATGID == undefined || hdata.MCCATGID == null)) { flag = false; msg = msg + "* Please Select Machine Category <br/>" }
    if ((hdata.MTTYPE == "C") && (hdata.customername == '' || hdata.customername == undefined || hdata.customername == null)) { flag = false; msg = msg + "* Please Select Machine Customer <br/>" }
    if (hdata.MTASSETID == null || hdata.MTASSETID == undefined || hdata.MTASSETID == '') { flag = false; msg = msg + "* Please Select Machine name <br/>" }
    if (hdata.MTDUEDATE == undefined || hdata.MTDUEDATE == '' || hdata.MTDUEDATE == null) { flag = false; msg = msg + "* Please select Required by date <br/>" }
    if (hdata.MTPRIORITYID == undefined || hdata.MTPRIORITYID == '' || hdata.MTPRIORITYID == null) { flag = false; msg = msg + "* Please select Priority <br/>" }

    if (flag == false) {
      const dialogRef = this.dialog.open(ValidationComponent, {
        data: {
          msg: msg,
          action: ''
        }
      });

      dialogRef.afterClosed().subscribe(result => {

      });
    }
    else {
      this.SaveMaintenanceticket(hdata, action)
    }
  }

  SaveMaintenanceticket(hdata, action) {
    this.isLoadingResults = true;
    var hdrDataarray: Array<any> = [];

    let id, MTNO, MTDATE, MTTIME, MTDUEDATE, MTDUETIME,MTPROBLEM;
    // if (hdata.id == undefined || hdata.id == null) { id = 0; } else { id = hdata.id; }
    if (hdata.MTNO == undefined || hdata.MTNO == null) { MTNO = 0; } else { MTNO = hdata.MTNO; }
    // if (hdata.MTDATE == undefined || hdata.MTDATE == null) { MTDATE = ''; } else { MTDATE = formatDate(hdata.MTDATE, 'yyyy-MM-dd ', 'en-US') }
    if (hdata.MTTIME == undefined || hdata.MTTIME == null) { MTTIME = '00:00:00'; } else { MTTIME = formatDate(hdata.MTTIME, 'hh:mm:ss', 'en-US') }
    // if (hdata.MTDUEDATE == undefined || hdata.MTDUEDATE == null || hdata.MTDUEDATE == '') { MTDUEDATE = ''; } else { MTDUEDATE = formatDate(hdata.MTDUEDATE, 'yyyy-MM-dd ', 'en-US') }
    if (hdata.MTDUETIME == undefined || hdata.MTDUETIME == null) { MTDUETIME = '00:00:00'; } else { MTDUETIME = formatDate(hdata.MTDUETIME, 'hh:mm:ss', 'en-US') }
    if (hdata.itemimage == undefined) { hdata.itemimage = '' }
    MTPROBLEM=this.globalVar.checknull(hdata.MTPROBLEM,'string')
    hdrDataarray.push(
      {
        ID: 0,
        TICKETSTATUS:hdata.TICKETSTATUS,
        MTNO: this.MTNO,
        MTDATE: formatDate(hdata.MTDATE, 'yyyy-MM-dd ', 'en-US'),
        MTTIME: MTTIME,
        MTDEPTID: hdata.MTDEPTID,
        MTTYPE: hdata.MTTYPE,
        MTCATG: hdata.MTCATG,
        MTTEMPID: hdata.MTTEMPID,
        MCCATGID:hdata.MCCATGID,
        MTASSETID: hdata.MTASSETID,
        MTDUEDATE: formatDate(hdata.MTDUEDATE, 'yyyy-MM-dd ', 'en-US'),
        MTDUETIME: MTDUETIME,
        MTPRIORITYID: hdata.MTPRIORITYID,
        MTPROBLEM: MTPROBLEM,
        MTOWNERID:"",
        MTMOID: "",
        MTASSETLOC: "",
        MTFREQID: "",
        MTSTATUSID: "1",
        MTLASTMAINTDATE: "",
        MTDELAYDAYS: "",
        MTDOCUPLOADED: hdata.MTDOCUPLOADED,
        COID: this.globalVar.CommpanyId,
        BOID: this.globalVar.BranchId,
        createdby: this.globalVar.UserId,
        createdon: formatDate(this.date, 'yyyy-MM-dd ', 'en-US'),
        modifiedby: "",
        modifiedon: ""
      });


    setTimeout(() => {
      this.isLoadingResults = false;
    }, 3000);

    const params = new HttpParams()
      .set('coid', this.globalVar.CommpanyId)
      .set('boid', this.globalVar.BranchId)
      .set('UserId', this.globalVar.userid)
      .set('statementtype', action)
      .set('headerarray', JSON.stringify(hdrDataarray))

    this.http.post(this.original_url + "/Maintenance/Ticket/Savemaintenanceticket", params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
      .subscribe((res) => {
        let temp;
        temp = res;
        MTNO = temp[0].MTNO;
        // const uploadReq = new HttpRequest('POST', 'http://suvidhaapi.suvidhacloud.com/api/Maintenance/Ticket/UploadFile?module=Maintenance&form=Ticket&MTNO=' + this.MTNO + '&coid=' + this.globalVar.CommpanyId + '&boid=' + this.globalVar.BranchId + '&fyid=' + this.globalVar.fyid + '&userid=' + this.globalVar.userid + '&osservertype=' + this.osservertype + '', this.formData, {
        //   reportProgress: true
        // });
        // this.http.request(uploadReq).subscribe(event => {
        //   if (event.type === HttpEventType.UploadProgress)
        //     this.progress = Math.round(100 * event.loaded / event.total);
        //   else if (event.type === HttpEventType.Response)
        //     this.message = event.body.toString();
        // });
        this.isLoadingResults = false;
        this.successDialog();
        this.router.navigate(['/maintenance-ticket']);
      });

  }

  successDialog() {
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      data: {
        wrongData: 'sucess'
      }
    });
  }
}
