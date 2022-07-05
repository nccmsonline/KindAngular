import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { LoginService} from './login.service';
import  {AddNewLoginComponent} from './add-new-login/add-new-login.component'
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
declare var $: any;
declare var jQuery: any;
import { MyserviceService } from '../../../myservice.service';
import { SuccessDialogComponent } from '../.././../Dialog/success-dialog/success-dialog.component';
import { SupplierFirstScreenComponent } from '../.././../Dialog/supplier-first-screen/supplier-first-screen.component';
import { Http } from '@angular/http';
// import { error } from 'util';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isCompanyList=""
  newData: any={};
  loginForm: FormGroup;
  loginValue: any;
  table1:any;
  table2:any;
  branch1:any;
  currentLesson='1';
  branch2:any;
  LogInId:any;isclicked:boolean;
  allData:any={};
  companyList:Array<any>=[];
  isLoadingResults=false;

  constructor(
  
    private router: Router,
    private loginService: LoginService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private data: MyserviceService,
    ) {
      this.createForm();
    
    }

  ngOnInit() {
    this.newData.COMPANYID=1;
    this.newData.companyname='KAPSONS';

    this.loginService.getCompanyList().subscribe((res)=>{
        this.allData=res;
        this.companyList=this.allData.Table;
    });

  }

  createForm() {
    this.loginForm = this.fb.group({
      companyname: ['', Validators.required ],
      UserName: ['', Validators.required ],
      Password: ['', Validators.required ]    
    });
  }
  WrongDetailDialog(pMsg){
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      data: {
        wrongData: 'wrongData',
        displayMsg:pMsg

      }
    });
    this.isclicked=false;
  }
  isFieldValid(field: string) {
    return !this.loginForm.get(field).valid && this.loginForm.get(field).touched;
  }

  displayFieldCss(field: string) {
    return {
      'has-error': this.isFieldValid(field),
      'has-feedback': this.isFieldValid(field)
    };
  }
  onCompanyClick()
  {
    this.isCompanyList="-"
  }
  onCompanySelect(row, Data)
  {
    this.isCompanyList="";
    console.log("my data",Data);
    Data.COMPANYID=row.COMPANYID;
    Data.companyname=row.COMPANYNAME;
  }
  login(data)
  {
    this.isLoadingResults=true;
    this.isclicked=true;
    this.data.changeMessage("Asteriks Infosystem");
    if (this.loginForm.valid) {
      this.currentLesson = '2';
    this.loginService.getFillFyData(data)
      .subscribe((response) => {
        this.isLoadingResults=false;
         if(response=="ravinder")
         {
          this.currentLesson = '1';
          console.log("response",response);
          this.WrongDetailDialog("Sorry, Your Credentials are NOT Verified.");
         }
         else
         {
          this.loginValue = response;
          console.log("response",response);
          this.loginValue = this.loginValue.Table;
          this.loginValue = this.loginValue[0];
          this.LogInId=this.loginValue.USERID;
          this.table1=response;
          this.table1=this.table1.Table1;
          this.table2=response;
          this.table2=this.table2.Table2;
          console.log("11", this.table1);
          console.log("12", this.table2);
          console.log("ravi", this.loginValue);
          if(this.loginValue)
          {
            console.log("login",this.loginValue);
            var companyData:any={};
            companyData.COMPANYID=this.newData.COMPANYID;
            companyData.companyname=this.newData.companyname;
            sessionStorage.setItem('companyData', JSON.stringify(companyData));
            sessionStorage.setItem('currentUser', JSON.stringify(this.loginValue));
           // console.log("werwerwerwerwerwer",  JSON.stringify(this.loginValue));
          //  console.log("werwerwerwerwerwer",  this.loginValue);
            if(sessionStorage){
            
              const dialogRef = this.dialog.open(AddNewLoginComponent, {
                width: '600px',
                data: {
                 branch:this.table1,
                 branch1:this.table2,
                 userid:this.LogInId,
                 companyid:this.newData.COMPANYID
                }
                });
                dialogRef.afterClosed().subscribe(result => {
                  this.currentLesson = '1';
                });
            }
           // this.router.navigate(['/home']);
          }
          else
          {
            this.WrongDetailDialog("Sorry, Your Credentials are NOT Verified.");
            this.currentLesson = '1';
          }
        }
      },
      error =>{
        console.log("sdf");
        this.currentLesson='2';
        this.currentLesson = '1';
        this.isLoadingResults=false;
      });
    } else {
      this.validateAllFormFields(this.loginForm);
    }
  }



  logout()
  { console.log("hello");
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentBranch');
    
   // this.dialogRef.close();
    console.log("hello");
  }
  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }
  supplierProfile()
  {
    let dailogResult="";
    const dialogRef = this.dialog.open(SupplierFirstScreenComponent, {
      data: {
        dailogType:'OTP',
        msg:'Supplier Profile'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed',result);
      dailogResult=result.cl;
      console.log('The dialog was closed1',dailogResult);
    if(dailogResult=="ok")
    {
      this.loginService.getPartyDetail(result.gstin, result.mobile).subscribe((res)=>{
          console.log("supplier data",res );
          if(res=="Ravinder")
          {
            this.WrongDetailDialog("Something went wrong!");
          }
          else
          {
            sessionStorage.setItem('supplierData', JSON.stringify(res));
            this.router.navigate(['/all-supplier-master'], {skipLocationChange:true});
            //
          }
      },
      error=>{
        this.WrongDetailDialog("Something went wrong!");
      });
    }
    });
  }
}