import { Component, OnInit,Inject } from '@angular/core';
import { Router} from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
//import { MyserviceService } from '../../../../myservice.service';
import { checkAndUpdatePureExpressionInline } from '@angular/core/src/view/pure_expression';
import { LoginService} from '../login.service';
import { SuccessDialogComponent } from '../../../../Dialog/success-dialog/success-dialog.component';
@Component({
  selector: 'app-add-new-login',
  templateUrl: './add-new-login.component.html',
  styleUrls: ['./add-new-login.component.css'],
 
})
export class AddNewLoginComponent implements OnInit {
  newData: any={}; 
  Logincredentials: FormGroup;
  // private _appComponent:AppComponent;
  branch1:any;
  branch2:any;
  userid:any;
  loginValue: any;
  userinfo:any;
  username:any;mainmenulist:any=[];allData:any;
  isadmin:any;IsAdmin:any;accToken:any;
  show:any;boid:any;isclicked:boolean;
  constructor(
    @Inject('BASE_URL') private baseUrl : string,
    private router: Router,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddNewLoginComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    //private mydata:MyserviceService,
    private loginService:LoginService
  ) {
    this.isclicked=false;
    this.createForm();
    console.log("data", data);
    this.branch1=data;
    this.branch1=data.branch;
    this.branch2=data;
    this.branch2=data.branch1;
    this.userid=data.userid;
    console.log("branch",this.branch1)
    console.log("userid",this.userid)
   }

  ngOnInit() {
    
    
  }

  createForm() {
    this.Logincredentials = this.fb.group({
      branch: ['', Validators.required ],
      financialyear: ['',Validators.required],
    
    });
  }
  login(data){
    this.isclicked=true;
    let login = sessionStorage.getItem("currentUser");
    this.userinfo = JSON.parse(login);
    this.isadmin=this.userinfo['ISADMIN'];
    this.accToken=this.userinfo['TOKEN'];
    this.getFillFyData(data)
      .subscribe((response) => {
        this.loginValue = response;
        this.loginValue = this.loginValue.Table;
        this.loginValue = this.loginValue[0];
        this.boid=this.loginValue.BRANCHID;
        sessionStorage.setItem('currentBranch', JSON.stringify(this.loginValue));
        this.show= true;
        this.loginService.getUrl(this.show, this.userinfo,  this.loginValue);

        let login = sessionStorage.getItem("currentUser");
        this.userinfo = JSON.parse(login);
        
       
        this.IsAdmin= this.userinfo['ISADMIN'];

        this.loginService.getmenulist(this.userid,this.IsAdmin,this.boid)
        .subscribe((response) => {
          this.allData=response;
       
               this.mainmenulist=this.allData;
               sessionStorage.setItem('menuList', JSON.stringify(this.mainmenulist));
                console.log("menu",response);
                this.router.navigate(['/home']);
                this.dialogRef.close();
                this.isclicked=false;
        });
        

       });

  }
  logout()
  {
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentBranch');
    this.dialogRef.close();
  }
 

  getFillFyData(data)
  {
      return this.http.get(this.baseUrl+"/User/getLogingDetail?branchid="+data.branch+"&fyid="+data.financialyear+"&userid="+this.userid+"&token="+this.accToken+"&macadd=abcd")
      .pipe(
        map((data) => {
          return data;
        })
    );
  }
 }



 
@Component({
  selector: 'changePassword',
  templateUrl: 'changePassword.html',
  styleUrls: ['./add-new-login.component.css'],
})

export class ChangePassword {
  boid : any;FYUSER:any;ServerIP:any;
  newData:any={};userid:any;
  constructor(@Inject('BASE_URL') private original_url : string,private http: HttpClient,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ChangePassword>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      console.log("itemanme",data);
     let currentBranch = sessionStorage.getItem("currentBranch");
      var CompanyData = JSON.parse(currentBranch);
      this.ServerIP=CompanyData['SERVERIP'];
      this.FYUSER=CompanyData['FYUSER'];
      this.boid = CompanyData['BRANCHID'];
      let login = sessionStorage.getItem("currentUser");
      login = JSON.parse(login);   
      this.userid = login['USERID'];
        
    }
  onNoClick(): void {
    var flag:boolean, msgBox:string;
    flag=true;
    msgBox="<b>Please rectify following mistakes first:-"+'</b><br><br> <ul>';
    if(this.newData.CURRENTPASSWORD=='' ||this.newData.CURRENTPASSWORD==undefined)
    {
      flag=false;
      msgBox=msgBox+"<li>Current password not entred."+'</li>';
    }
    if(this.newData.NEWPASSWORD=='' ||this.newData.NEWPASSWORD==undefined)
    {
      flag=false;
      msgBox=msgBox+"<li>New password not entred."+'</li>';
    }
    if(this.newData.CONFIRMPASSWORD=='' ||this.newData.CONFIRMPASSWORD==undefined)
    {
      flag=false;
      msgBox=msgBox+"<li>Confirm password not entred."+'</li>';
    }

    if(this.newData.CONFIRMPASSWORD!=this.newData.NEWPASSWORD)
    {
      flag=false;
      msgBox=msgBox+"<li>New password not matched with confirm password."+'</li>';
    }

    msgBox=msgBox+"</ul>";
    if(flag==false) {
     console.log("msgBox",msgBox);
     const dialogRef = this.dialog.open(SuccessDialogComponent, {
      data: {
        wrongData: 'validation',
        displayMsg:msgBox
      }
    });
     }
    else
    {


console.log("a");
var retunrOrderNo:any;

        const  params = new  HttpParams()
        .set('userid', this.userid)
        .set('cp',this.newData.CURRENTPASSWORD.trim().toUpperCase())
        .set('np', this.newData.NEWPASSWORD.trim().toUpperCase())
        console.log(" params.toString()", params.toString());

        this.http.post(this.original_url+"/user/convertdata", params.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
        .subscribe((res) => {
        retunrOrderNo=res;
        console.log("respose",res);
        if (parseInt(retunrOrderNo)>0)
        {
                const dialogRef1 = this.dialog.open(SuccessDialogComponent, {
                  data: {
                    wrongData: 'sucess',
                    displayMsg:'Password Changed'
                  }
                });
                this.dialogRef.close();
        }
        else if (parseInt(retunrOrderNo)==-99)
        {
                const dialogRef1 = this.dialog.open(SuccessDialogComponent, {
                  data: {
                    wrongData: 'wrongData',
                    displayMsg:'In-valide current password'
                  }
                });
               // this.dialogRef.close();
        }
        else
        {
                  const dialogRef1 = this.dialog.open(SuccessDialogComponent, {
                    data: {
                      wrongData: 'wrongData',
                      displayMsg:'Somthing went wrong'
                    }
                  });
        }
        });

    }
   
  }
}