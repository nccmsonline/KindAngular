import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GeneralLedgerService } from '../general-ledger.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Subscription, Observable,BehaviorSubject } from 'rxjs';
import {ConfirmationDialogComponent} from '../../../../Dialog/confirmation-dialog/confirmation-dialog.component'
import {ConfirmationDialogService} from '../../../../Dialog/confirmation-dialog/confirmation-dialog.service'
@Component({
  selector: 'app-add-new-general-ledger',
  templateUrl: './add-new-general-ledger.component.html',
  styleUrls: ['./add-new-general-ledger.component.css']
})
export class AddNewGeneralLedgerComponent implements OnInit {
  subscription: Subscription;
  message: any;
  newData: any={};
  generalledgerForm: FormGroup;
  action: string;
  currentSection = 'section1';
  accountheads : any;
  userinfo : any;
  coid : any;
  boid : any

  constructor(
    public dialogRef: MatDialogRef<AddNewGeneralLedgerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private http: HttpClient,
    private messageService: ConfirmationDialogService,
    private generalLedgerService: GeneralLedgerService,
    public dialog: MatDialog
  ) {
    let user = sessionStorage.getItem("currentUser");
    this.userinfo = JSON.parse(user);
    this.coid = this.userinfo['coid'];
    this.boid = this.userinfo['boid'];

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
      console.log("this.newData", this.newData);
    }

  }

  ngOnInit() {
    this.generalLedgerService.getGetGLAllAccountGroup()
    .subscribe((response) => {
       this.accountheads= response;
      this.accountheads= this.accountheads.Table; 
      console.log("qwerty",this.accountheads);
    });
    
  }

  createForm() {
    this.generalledgerForm = this.fb.group({
      accounthead: ['', Validators.required ],
      groupname: ['',Validators.required],
      yob: ['',Validators.required],
      drcr: ''
      
    });
  }

  onSectionChange(sectionId: string) {
    this.currentSection = sectionId;
  }

  scrollTo(section) {
    document.querySelector('#' + section)
    .scrollIntoView();
  }

  savegeneralledger(data)
  {
    console.log("accounthead", data.accounthead);
    console.log("groupname", data.groupname);
    console.log("yob", data.yob);

    this.http.post("https://cors-anywhere.herokuapp.com/http://suvidhaapi.suvidhacloud.com/api/Masters/GLAccountHeads/manageGLAccountHead?name="+data.accounthead+"&groupid="+data.groupname+"&yob="+data.yob+"&coid="+this.coid+"&boid="+this.boid+"&userid="+this.userinfo+"&statementtype=Insert",{data: ''})
      .subscribe((res) => {
         console.log("dfgdfgdfgdfgg", res);
         this.generalLedgerService.savePushData(data);
      });

    //  console.log("data", data);
     
    this.dialogRef.close();
  }

  updategeneralledger(data)
  {
    this.dialogRef.close();
  }
  closeDialog() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px'  
      });
  }
  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }

}
