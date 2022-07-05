import { Global } from './../../../../../Global';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-material-transfer-to-blanking',
  templateUrl: './add-material-transfer-to-blanking.component.html',
  styleUrls: ['./add-material-transfer-to-blanking.component.css']
})
export class AddMaterialTransferToBlankingComponent implements OnInit {

  original_url = environment.baseUrl;
  newData:any={};
  KRAArray:Array<any>=[];
  toolTypeArray:Array<any>=[];
  toolNoArray:Array<any>=[];
  contacts: Array<any> = [];
  requisitionform: FormGroup;
  newContact: any = {};
  editContactID: any={};
  isLoadingResults:false;
  arrayItemCustomer: any = '';
  isLoading = false;
  allDataGet: any;
  photosBuffer: Array<any> = [];
  contact: any = {};


  constructor(
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private translate: TranslateService,
    private router: Router,
    private globalVar: Global,
    private http: HttpClient,
    public dialog: MatDialog,
  ) {

    this.contacts=[
      {id:1,description:"description1",frameno:"250",cutcoil:"4.8",width:"4.05",weight:"1.34",noofcutting:"21",wastage:"13000",remarks:"Test Remarks 1"} ,                                      
      // {id:2,description:"description2",frameno:"200",cutcoil:"3.8",width:"84.05",weight:"3.46",noofcutting:"54",wastage:"155000",remarks:"Test Remarks 2"} ,
      // {id:3,description:"description3",frameno:"600",cutcoil:"3.6",width:"34.55",weight:"5.67",noofcutting:"48",wastage:"235000",remarks:"Test Remarks 3"} , 
    ]
    }

    ngOnInit() {
    }

    addContact(){
      this.contacts.push(this.newContact);
      this.contacts.forEach((item,index) => {
        var num = 'id';
        var value = index+1;
        item[num] = value;
      });
      this.newContact = {};
    }
    removeContact(index){
      this.contacts.splice(index,1);
    }
    editContact(val){
      this.editContactID = val;
    }
    updateContact(val){
      this.editContactID = {};
    }
  
    validateBeforeSave(id,data){
      
    }
    searchTermCustomer(event) {
      let term: any;
      term = event.target.value;
      this.arrayItemCustomer = term;
      if (this.arrayItemCustomer !== '') {
        this.isLoading = true;
        this.http.get(this.original_url+"/Masters/CommonMaster/Getcustomersupplierlist?PageNumber=1&PageSize=100coid="+this.globalVar.CommpanyId+"&boid="+this.globalVar.BranchId+"&search=" + this.arrayItemCustomer+"&type=C")
          .subscribe((respose) => {
            this.isLoading = false;
            this.allDataGet = respose;
            this.allDataGet = this.allDataGet.Table;
            this.photosBuffer = this.allDataGet;
          },error => {
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
      data.PARTYNAME = '';
      data.PARTYID = '';
      this.onChangeOfItemCodeCustomer(null, null);
    }
    onChangeOfItemCodeCustomer(data, rowDetail) {
      if (data == null) {
  
        this.newData.PARTYID = '';
        this.newData.PARTYNAME = '';
  
      }
      else {
  
        this.newData.PARTYID = data.CUSTOMERID;
        this.newData.PARTYNAME = data.NAME;
        this.arrayItemCustomer = '';
  
      }
      
    }

  
    
  
  
  
  }
  