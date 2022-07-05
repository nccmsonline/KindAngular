import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-password-popup',
  templateUrl: './password-popup.component.html',
  styleUrls: ['./password-popup.component.css']
})
export class PasswordPopupComponent implements OnInit {
  password: any;
 newform: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<PasswordPopupComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { 
    this.createForm();
  }

  ngOnInit(): void {
  }

  createForm() {
    this.newform = this.fb.group({
      password: '',
    });
  }

  ok(data){
    this.dialogRef.close({ password: this.password, });
  }

}
