import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Global } from 'src/app/Global';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-rotor-die-casting-production',
  templateUrl: './add-rotor-die-casting-production.component.html',
  styleUrls: ['./add-rotor-die-casting-production.component.css']
})
export class AddRotorDieCastingProductionComponent implements OnInit {
  @ViewChildren('oldcodefocus') vc;
  original_url = environment.baseUrl;
  newData: any = {};
  requisitionform: FormGroup;
  myDate = new Date();
  contacts: Array<any> = [];
  contact: any = {};
  isLoadingResults :boolean;
  id: any;
  toolTypeArray: Array<any> = [];
  toolNoArray: Array<any> = [];
  userArray: Array<any> = [];
  maintOfficerArray: Array<any> = [];
  ToolSectionArray: Array<any> = [];
  yesornoArray: Array<any> = [];
  reasonArray: Array<any> = [];
  delayReason: Array<any> = [];
  action: any;
  arrayItemCustomer: any = '';
  isLoading = false;
  allDataGet: any;
  photosBuffer: Array<any> = [];
  PoleArray: Array<any> = [];
  MachineArray: Array<any> = [];
  StatusArray: Array<any> = [];
  FrameArray: Array<any> = [];
  DieTypeArray: Array<any> = [];
  EfficiencyArray: Array<any> = [];
  LastOperationArray: Array<any> = [];
  framenoArray: Array<any> = [];
  ColourArray: Array<any> = [];
  ProcessArray: Array<any> = [];
  userRightCheck: any = {};
  // framenoArray: Array<any> = [];


  constructor(
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private translate: TranslateService,
    private router: Router,
    private globalVar: Global,
    private http: HttpClient,
    public dialog: MatDialog,
  ) {
    let languageSet = sessionStorage.getItem("languageSet");
    translate.setDefaultLang(languageSet);

    this.createForm();
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.action = this.activatedRoute.snapshot.paramMap.get('action');

}

  ngOnInit(): void {
  }
  createForm() {
    this.requisitionform = this.fb.group({
      deptid: ['', Validators.required],
      costcentreid: ['', Validators.required],
      reqndate: '',
      batchmfgdate: '',
      batchexpirydate: '',
      storeid: ['', Validators.required],
      manualslipno: '',
      batchno: '',
      uom: '',
      productid: '',
      bomid: '',
      lotsize: '',
    });
  }
  dropdownHide(){
    
  }

}
