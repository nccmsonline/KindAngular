import { ActivatedRoute } from '@angular/router';
import { ExcelService } from './../../../../services/excel/excel.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { TreeModel} from 'ng2-tree'

@Component({
  selector: 'app-die-bom-view',
  templateUrl: './die-bom-view.component.html',
  styleUrls: ['./die-bom-view.component.css']
})
export class DieBomViewComponent implements OnInit {

  
  @ViewChild('treeFonts', { static: true }) public treeFonts;
  original_url = environment.baseUrl;
  currentEvent: string = 'start do something';
  myTree: Array<any> = [];
  sendkey: any;
  parentid: any;
  tree: TreeModel;
  bomid: any;
  dataarray: Array<any> = [];
  exportarray: Array<any> = [];
  isLoading= false;
  istrue:boolean=false;
  allGetdata:any;

  constructor(
    // private multilevelmasters: BomViewService,
    private http: HttpClient,
    private translate: TranslateService,
    private excelService: ExcelService,
    private activatedRoute: ActivatedRoute
  ) {
    let languageSet = sessionStorage.getItem("languageSet");
    translate.setDefaultLang(languageSet);

    this.bomid = this.activatedRoute.snapshot.paramMap.get('id');

    // this.multilevelmasters.getitems(this.bomid)
    //   .subscribe((response) => {
    //     if (response) {
    //       var data: any = [];
    //       data = response;
    //       this.dataarray = data;
    //       this.tree = {
    //         "id": "1",
    //         "value": "Item",
    //         "code": "N",
    //         "parentGroupId": "0",
    //         settings: {
    //           'leftMenu': true,
    //           'rightMenu': false,
    //           'static': true
    //         },
    //         templates: {
    //           leftMenu: '<i class="fa fa-navicon"></i>'
    //         },
    //         "children": data
    //       };
    //     }
    //   });
  }
  ngOnInit() {
    
  }
  exportToExcel() {
    this.isLoading = true;
    this.istrue=true;
    // this.multilevelmasters.getbomitems(this.bomid)
    // .subscribe((response) => {
    //   this.allGetdata = response;
    //   this.allGetdata = this.allGetdata.Table;
    //   this.exportarray= this.allGetdata;
    //   this.isLoading= false;
    //   this.istrue=false;
    //   this.excelService.exportAsExcelFile(this.exportarray, 'BOM-master');
    // });
    
  // exportToExcel() {
  //   let parentarray = [];
  //   let childarray = []; let childarray1 = []; let childarray2 = [];
  //   let arr = []; let arr1 = []; let arr2 = [];
  //   this.dataarray.forEach(element => {
  //     arr.push(element.children);
  //   });
  //   this.dataarray.forEach(element => {
  //     if (element.children.length != 0) {
  //       element.children.forEach(element1 => {
  //         if (element1.children.length != 0) {
  //           arr1.push(element1.children);
  //         }
  //       })
  //     }
  //     return;
  //   });
  //   this.dataarray.forEach(element => {
  //     if (element.children.length != 0) {
  //       element.children.forEach(element1 => {
  //         if (element1.children.length != 0) {
  //           element1.children.forEach(element2 => {
  //             if (element2.children.length != 0) {
  //               arr2.push(element2.children);
  //             }
  //           });
  //         }
  //       })
  //     }
  //     return;
  //   });

  //   if(arr2.length!=0){
  //   childarray2 = arr2[0].map(res => {
  //     return {
  //       '     ': "=>",
  //       '      ': res.value,
  //       '       ': res.code,
  //     }
  //   });
  // }
  // if(arr1.length!=0){
  //   childarray1 = arr1[0].map(res => {
  //     return {
  //       children1: "=>",
  //       '   ': res.value,
  //       '    ': res.code,
  //       children2: res.children.length!=0?childarray2:[]
  //     }
  //   });
  // }
  // if(arr.length!=0){
  //   childarray = arr[0].map(res => {
  //     return {
  //       children: "=>",
  //       '  ': res.value,
  //       ' ': res.code,
  //       children1: res.children.length!=0?childarray1:[]
  //     }
  //   });
  // }

  //   parentarray = this.dataarray.map(res => {
  //     return {
  //       value: res.value,
  //       code: res.code,
  //       children: res.children.length!=0? childarray:[]
  //     }
  //   });
  //   this.exportarray = parentarray;
  //   this.excelService.exportAsExcelFile(this.exportarray, 'Bom-View');
  // }


 

}
}