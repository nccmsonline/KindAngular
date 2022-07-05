import { error } from '@angular/compiler/src/util';
import { Global } from './../../../../Global';
import { formatDate } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs/internal/operators/map';
import { startWith } from 'rxjs/internal/operators/startWith';
import { SuccessDialogComponent } from 'src/app/Dialog/success-dialog/success-dialog.component';
import { ValidationComponent } from 'src/app/validation/validation.component';
import { Observable, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-single-column-master',
  templateUrl: './add-single-column-master.component.html',
  styleUrls: ['./add-single-column-master.component.css']
})
export class AddSingleColumnMasterComponent implements OnInit {

  
  original_url = environment.baseUrl;
  newData: any={};
  singleMaster: FormGroup;
  actionGet: any;
  header: any;
  typeCategory: any;
  show: boolean = false;
  myDate = new Date();
  convertDAte: any;
  action: any;
  Itemlist :any;
  Itemlistnew : Array<any>=[];
  arrayList: Array<string> ;
  newarray:Array<string>;
  value: any ;
  myControl = new FormControl();
  filteredOptions: Observable<string[]>;
  dataGet: any;
  subscription: Subscription;
  message: any;
  compare: any;
  isLoading:boolean=false;
  errorMsg: any;
  idArray:Array<any>=[];
  entrycheck:any;
  allDataGet:any;
  receiptFieldArray: any={};
  id:any;
  userRightCheck:any={};
  canEditCommonClass = '';
  canCreateCommonClass ='';
  isLoadingResults: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddSingleColumnMasterComponent>,
    private http: HttpClient,
    private fb: FormBuilder,
    private translate: TranslateService,
    public dialog: MatDialog,
    private globalVar: Global
  ){
    let languageSet = sessionStorage.getItem("languageSet");
    translate.setDefaultLang(languageSet);

    this.createForm();
    this.entrycheck=data.entry;
    this.action = data.action;
    
    // User Right
    this.userRightCheck = data.userRightCheck;
    if(this.userRightCheck.cancreate == 'True') { this.canCreateCommonClass = ''; } 
    if(this.userRightCheck.canedit == 'True') { this.canEditCommonClass = ''; } 

    if(this.userRightCheck.cancreate == 'False') { this.canCreateCommonClass = 'canCreateCommonClass'; } 
    if(this.userRightCheck.canedit == 'False') { this.canEditCommonClass = 'canEditCommonClass'; } 
        
    if(this.action=='new'){
      this.id=0
    }
    else{
      this.id=data.data.id;
      this.newData.id=data.data.id;
      this.newData.name=data.data.name;
      this.newData.isactive=data.data.isactive;
    }
    this.actionGet = data.menutype;
    this.isLoadingResults=true;
      this.http.get(this.original_url+"/Masters/CommonMaster/GetsinglecolumnmastersList?coid="+this.globalVar.CommpanyId+"&boid="+this.globalVar.BranchId+"&userid="+this.globalVar.UserId+"&type="+this.actionGet)
      .subscribe(event => {
        this.Itemlist=event;
        this.receiptFieldArray= this.Itemlist.Table1; 
        this.Itemlist=this.Itemlist.Table;
       // this.Itemlist= this.Itemlist.filter( x => x.id !==this.id)
        this.Itemlistnew=this.Itemlist;
        this.isLoadingResults=false;
        if(this.Itemlistnew!== undefined )
        {
          
        this.arrayList= this.Itemlistnew.map(person=>person.NAME.trim());
        // alert(this.myControl.valueChanges)
        this.filteredOptions = this.myControl.valueChanges
        
        .pipe(
          startWith(''),
          map(value =>value.length >= 1 ? this._filter(value):[])
        );
        }

        this.header = this.receiptFieldArray[0].FROMNAME;
        this.typeCategory = this.receiptFieldArray[0].TYPE;
        this.errorMsg = this.receiptFieldArray[0].COLUMNNAME;
      
      },error => {
        this.isLoadingResults = false;
      });
    // this.subscription = 
    // this.messageService.getMessage()
    //   .subscribe(message => 
    //   {
    //     this.message= message;
    //     if(this.message != null)
    //     {
    //       this.dialogRef.close();
    //     }
    //   });
  }

  ngOnInit() {
  }

  ngAfterContentInit() {
    // this.http.get(this.original_url+"/Masters/CommonMasters/GetsinglecolumnmastersList?coid="+this.coid+"&boid="+this.boid+"&type="+this.actionGet)
    // .subscribe((res) => {
    //   this.allDataGet = res; 
    //   this.receiptFieldArray= this.allDataGet.Table2; 
    //   this.header = this.receiptFieldArray[0].fromname;
    //   this.typeCategory = this.receiptFieldArray[0].type;
    //   this.errorMsg = this.receiptFieldArray[0].columnname;
    // });
  }

  _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.arrayList.filter(option => option.toLowerCase().includes(filterValue));
  }

  createForm() {
    this.singleMaster = this.fb.group({
      id: '',
      name: [null, Validators.required ],
    });
  }

  successDialog(){
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      data: {
        wrongData: 'sucess'
      }
    });
  }

  saveData(data, actiondata, action)
  {
    this.isLoadingResults=true;
    this.value=this.myControl;
    this.compare = this.value
    if(this.compare._pendingValue == undefined){this.compare._pendingValue = ''}
    this.compare=this.compare._pendingValue.toLowerCase().trim();
    
    if(this.compare == '' || this.compare == undefined || this.compare == null)
    {
      let msg = "* Please enter Item";
      const dialogRef = this.dialog.open(ValidationComponent, {
        data: {
          msg: msg,
          action: ''
        }
      });
    } else {
      this.isLoading=true;
      this.show=false; let isactive: any;
      this.convertDAte = formatDate(this.myDate, 'yyyy-MM-dd', 'en-US');
      if(this.arrayList == undefined )
      {
        this.arrayList=[];
      }
      this.newarray=this.arrayList.map(v => v.toLowerCase());
      if(this.newarray.find( fruit => fruit == this.compare) )
      {
        this.show=true;
        setTimeout(() => {
          this.isLoading=false;
        }, 500);
      }
      else
      {
        this.show=false;
        this.value = this.value._pendingValue;
        setTimeout(() => {
          this.isLoading=false;
        }, 500);
        if(this.value != undefined)
        {
          let mainID : any;
          if(action == 'Insert')
          {
            mainID = '0';
            isactive = true;
          }
          else if(action == 'update')
          {
            mainID = data.id;
            isactive = this.newData.isactive;
          }
          setTimeout(() => {
            this.isLoading=false;
          }, 3000);
          const  params = new  HttpParams()
            .set('coid', this.globalVar.CommpanyId)
            .set('boid', this.globalVar.BranchId)
            .set('userid', this.globalVar.userid)
            .set('type', actiondata)
            .set('statementtype', action)
            .set('id', mainID)
            .set('name', this.value)
  
            this.http.post(this.original_url + "/Masters/CommonMaster/savesinglecolumnmasters", params.toString(), {
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            })
              .subscribe(res => {
                if(this.entrycheck=='customer'){
                  this.dialogRef.close({success: 'success', value: this.value});
                
                } else if(this.entrycheck=='supplier'){
                  this.dialogRef.close({success: 'success', value: this.value});
                }
                else if(this.entrycheck == 'itemmaster'){
                  this.dialogRef.close({success: 'success', value: this.value});
                }else{
                // this.singleColumnMasterService.savePushData(res, actiondata);
                this.isLoading=false;
                this.successDialog();
                this.dialogRef.close(this.value);
                // this.di
                }
              },error => {
                this.isLoadingResults = false;
              }
              );
          }
        }
      }
  }

}
