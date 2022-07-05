import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { LoginService} from './login.service';
import  {AddNewLoginComponent} from './add-new-login/add-new-login.component'
import { MatDialog, MAT_DIALOG_DATA, MatSort, MatTableDataSource,MatPaginator } from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
declare var $: any;
declare var jQuery: any;
import { MyserviceService } from '../../../myservice.service';
import { SuccessDialogComponent } from '../.././../Dialog/success-dialog/success-dialog.component';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  newData: any={};
  loginForm: FormGroup;
  loginValue: any;
  table1:any;
  table2:any;
  branch1:any;
  branch2:any;
  LogInId:any;isclicked:boolean;
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

  }

  createForm() {
    this.loginForm = this.fb.group({
      UserName: ['', Validators.required ],
      Password: ['', Validators.required ]    
    });
  }
  WrongDetailDialog(){
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      data: {
        wrongData: 'wrongData',
        displayMsg:'Sorry, Your Credentials are NOT Verified.'

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
  login(data)
  {
    this.isclicked=true;
    this.data.changeMessage("Asteriks Infosystem");
    if (this.loginForm.valid) {
    this.loginService.getFillFyData(data)
      .subscribe((response) => {
         if(response=="ravinder")
         {
          console.log("response",response);
          this.WrongDetailDialog();
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
            sessionStorage.setItem('currentUser', JSON.stringify(this.loginValue));
           // console.log("werwerwerwerwerwer",  JSON.stringify(this.loginValue));
          //  console.log("werwerwerwerwerwer",  this.loginValue);
            if(sessionStorage){
            
              const dialogRef = this.dialog.open(AddNewLoginComponent, {
                width: '600px',
                data: {
                 branch:this.table1,
                 branch1:this.table2,
                 userid:this.LogInId
                }
                });
            }
           // this.router.navigate(['/home']);
          }
          else
          {
            this.WrongDetailDialog();
          }
        }
      });
    } else {
      this.validateAllFormFields(this.loginForm);
    }
  }



  logout()
  { console.log("hello");
    sessionStorage.removeItem('currentUser');
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
}