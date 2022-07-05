
import { Component, OnInit, ElementRef, ViewChild , Inject  } from '@angular/core';
import { NgbModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';  
declare var $: any;
declare var jQuery: any;
import {EmployeeMasterService} from '../employee-master.service'
import { Subscription, Observable } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-new-employee-master',
  templateUrl: './new-employee-master.component.html',
  styleUrls: ['./new-employee-master.component.css']
})
export class NewEmployeeMasterComponent implements OnInit {

  newData: any={};
  employeeForm: FormGroup;
  action: string;

  constructor(
    private fb: FormBuilder,
    private  employeeeMasterService: EmployeeMasterService,
    public dialogRef: MatDialogRef<NewEmployeeMasterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog
  ) { 
    this.createForm();

    this.action = data.action;
    if(this.action == 'edit')
    {
      this.newData = data.contact;
    }
  }

  ngOnInit() {
   
    $(document).ready(function(){
      $('.personal_info').addClass('active');
      $(".personal_info").on('click', function(event) {
        $('.personal_info').addClass('active');
        $('.statutory_info').removeClass('active');
        $('.banking_info').removeClass('active');
        $('.educational_info').removeClass('active');
        $('.previous_experience').removeClass('active');  
        $('.previous_trainings').removeClass('active');
          $('h4#personal_info').animate({
            scrollTop: $('#personal_info').offset().top
          }, 100, function(){
            window.location.hash = 'personal_info';
          });
      });

      $(".statutory_info").on('click', function(event) {      
        $('.statutory_info').addClass('active');
        $('.personal_info').removeClass('active');
        $('.banking_info').removeClass('active');
        $('.educational_info').removeClass('active');
        $('.previous_experience').removeClass('active');  
        $('.previous_trainings').removeClass('active');
        $('h4#statutory_info').animate({
          scrollTop: $('#statutory_info').offset().top
        }, 100, function(){
          window.location.hash = 'statutory_info';
        });
      });

      $(".banking_info").on('click', function(event) {      
        $('.banking_info').addClass('active');
        $('.personal_info').removeClass('active');
        $('.statutory_info').removeClass('active');
        $('.educational_info').removeClass('active');
        $('.previous_experience').removeClass('active');  
        $('.previous_trainings').removeClass('active');
        $('h4#banking_info').animate({
          scrollTop: $('#banking_info').offset().top
        }, 100, function(){
          window.location.hash = 'banking_info';
        });
      });

      $(".educational_info").on('click', function(event) {
        $('.educational_info').addClass('active');
        $('.personal_info').removeClass('active');
        $('.statutory_info').removeClass('active');
        $('.banking_info').removeClass('active');
        $('.previous_experience').removeClass('active');  
        $('.previous_trainings').removeClass('active');
        $('h4#educational_info').animate({
          scrollTop: $('#educational_info').offset().top
        }, 100, function(){
          window.location.hash = 'educational_info';
        });
      });
      $(".previous_experience").on('click', function(event) {
        $('.previous_experience').addClass('active');
        $('.personal_info').removeClass('active');
        $('.statutory_info').removeClass('active');
        $('.banking_info').removeClass('active');
        $('.educational_info').removeClass('active');
        $('.previous_trainings').removeClass('active');
        $('h4#previous_experience').animate({
          scrollTop: $('#previous_experience').offset().top
        }, 100, function(){
          window.location.hash = 'previous_experience';
        });
      });
      $(".previous_trainings").on('click', function(event) {    
        $('.previous_trainings').addClass('active');
        $('.personal_info').removeClass('active');
        $('.statutory_info').removeClass('active');
        $('.banking_info').removeClass('active');
        $('.educational_info').removeClass('active');
        $('.previous_experience').removeClass('active');  
        $('h4#previous_trainings').animate({
          scrollTop: $('#previous_trainings').offset().top
        }, 100, function(){
          window.location.hash = 'previous_trainings';
        });
      });
    });
  }

  createForm() {
    this.employeeForm = this.fb.group({
      customer_name: ['',Validators.required],
      address: ['',Validators.required],
      country: ['',Validators.required],
      state: ['',Validators.required],
      pin: ['',Validators.required],
      email: ['',Validators.required],
      mobile_number: ['',Validators.required],
      phone_number: ['',Validators.required],
      addhar: ['',Validators.required],
      pan:['',Validators.required],
      esi:['',Validators.required],
      pf:['',Validators.required],
      uan:['',Validators.required],
      passport:['',Validators.required],
      passvalid:['',Validators.required],
      passissuedby:['',Validators.required],
      tds_rate:['',Validators.required],
      bankers:['',Validators.required],
      bank_account_number:['',Validators.required],
      ifsc:['',Validators.required]
    });
  }

  saveNewEmployee(data)
  {
    console.log("data", data);
    this.employeeeMasterService.savePushData(data);
    this.dialogRef.close();
  }

  updateNewEmployee(data)
  {
    this.dialogRef.close();
  }


}
