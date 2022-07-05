import { Component, OnInit, Inject,OnDestroy } from '@angular/core';
import { AccountGroupMasterService } from '../account-group-master.service';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient,HttpParams } from '@angular/common/http';
import { Subscription } from 'rxjs';
import {ConfirmationDialogComponent} from '../../../../Dialog/confirmation-dialog/confirmation-dialog.component'
import {ConfirmationDialogService} from '../../../../Dialog/confirmation-dialog/confirmation-dialog.service'

@Component({
  selector: 'app-add-new-account-group-master',
  templateUrl: './add-new-account-group-master.component.html',
  styleUrls: ['./add-new-account-group-master.component.css']
})
export class AddNewAccountGroupMasterComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  message: any;
  fieldArray: Array<any> = [];
  closeResult: string;
  newData: any={};
  searchText : string;
  p: number = 1;
  itemPerPage = '10';
  accountgroup: FormGroup;
  accountheads : any;
  action: string;
  userinfo : any;
  coid : any;
  boid : any;
  userID: any;
  subLedgerId: any;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private  accountGroupMasterService:  AccountGroupMasterService,
    public dialogRef: MatDialogRef<AddNewAccountGroupMasterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private messageService: ConfirmationDialogService,
    public dialog: MatDialog
  ) {
    this.subscription = 
    this.messageService.getMessage()
    .subscribe(message => 
      {
         this.message= message;
        
         if(this.message != null)
       {
       
        this.dialogRef.close();
       }
     
      });
    this.createForm();

    this.action = data.action;
    if(this.action == 'edit')
    {
      this.newData = data.contact;
    }
    
  }

  ngOnInit() {
    this.accountGroupMasterService.getGetGLAccountHeads()
    .subscribe((response) => {
      this.accountheads= response;
      this.accountheads= this.accountheads.Table;
   console.log(this.accountheads);
    });
    

   
  }

  createForm() {
    this.accountgroup = this.fb.group({
      NAME: ['', Validators.required ],
      PARENTGROUPID: ['',Validators.required],
      position: ['',Validators.required],
      subledger: '',
    });
  }

  saveaccounthead(data)
  {
    let user = sessionStorage.getItem("currentUser");
     this.userinfo = JSON.parse(user);
     this.coid = this.userinfo['coid'];
     this.boid = this.userinfo['boid'];
     this.userID = this.userinfo['userid'];

     if(data.subledger == undefined)
     { 
        data.subledger = false;
     }
        if(data.subledger == true){
         this.subLedgerId = '1';
        }
        else{
        this.subLedgerId = '0';
        }
     
    this.http.post("https://cors-anywhere.herokuapp.com/http://suvidhaapi.suvidhacloud.com/api/Masters/GLAccountGroup/manageGLAccountGroup?name="+data.NAME+"&parentgroupid="+data.PARENTGROUPID+"&subledger="+this.subLedgerId+"&position="+data.position+"&coid="+this.coid+"&boid="+this.boid+"&userid="+this.userID+"&statementtype=Insert",{data: ''})
    .subscribe((res: any[]) => {
      //  console.log("res", res.Table[0]);
      this.accountGroupMasterService.savePushData(res);
    });
    // console.log("data", data);
    // this.accountGroupMasterService.savePushData(data);
    this.dialogRef.close();
  }

  updateaccountgroup(data)
  {
    this.dialogRef.close();
  }
  
  
ngOnDestroy() {
  // unsubscribe to ensure no memory leaks
  this.subscription.unsubscribe();
}
closeDialog() {
  const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    width: '300px'  
    });
}
}