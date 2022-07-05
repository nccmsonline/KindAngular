import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-technical-assessment',
  templateUrl: './technical-assessment.component.html',
  styleUrls: ['./technical-assessment.component.css']
})
export class TechnicalAssessmentComponent implements OnInit {
  newData:any={};editItemID:any;isLoadingResults:any;routeAction:any;
  newItem:any={};listNoOfOperations:Array<any>=[];listRDCTools:Array<any>=[];

  constructor() { }

  ngOnInit() {
  }

}
