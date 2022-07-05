import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmployeeMasterService {
  private onfieldArrayPush: BehaviorSubject<any> = new BehaviorSubject<any>('');
  public onDataChanged: Observable<any> = this.onfieldArrayPush.asObservable();
  http: any;
  original_url: string;

  constructor() { }



  savePushData(data)
  {
    this.onfieldArrayPush.next(data);
  }
  getImage(newData, osservertype, employeeID): Observable<Blob> {
    return this.http.get(this.original_url+'/Common/DownloadFile?url='+newData.emp_image+'&fileName='+newData.filename+'&osservertype='+osservertype+'&module=master&form=employee&RefNo='+employeeID, { responseType: 'blob' });
  }

  getImagecommon(newData,filepath, osservertype, id): Observable<Blob> {
    return this.http.get(this.original_url+'/Common/DownloadFile?url='+filepath+'&fileName='+newData+'&osservertype='+osservertype+'&module=SOP&form=SOP-form&RefNo='+id, { responseType: 'blob' });
  }

  getpmsimgImagecommon(newData,filepath, osservertype, id,msid,actid): Observable<Blob> {
    return this.http.get(this.original_url+'/pms/PMS/DownloadFile?url='+filepath+'&fileName='+newData+'&osservertype='+osservertype+'&module=PMS&form=PMS-form&projid='+id +'&msid=' +msid + '&actid=' + actid, { responseType: 'blob' });
  }

  getpmsImagecommon(newData,filepath, osservertype, id): Observable<Blob> {
    return this.http.get(this.original_url+'/Common/DownloadFile?url='+filepath+'&fileName='+newData+'&osservertype='+osservertype+'&module=PMS&form=PMS-reply&RefNo='+id, { responseType: 'blob' });
  }

  downloadImagepmsimgcommon(url, fileenamee, osservertype,  id,msid,actid):Observable<Blob>{
    return this.http.get(this.original_url + '/pms/PMS/DownloadFile?url='+url+'&fileName='+fileenamee+'&osservertype='+osservertype+'&module=PMS&form=PMS-form&projid='+id +'&msid=' +msid + '&actid=' + actid, { responseType: "blob" } );
  } 
  getcncmstImagecommon(newData, osservertype, id): Observable<Blob> {
    return this.http.get(this.original_url+'/Common/DownloadFile?url=&fileName='+newData+'&osservertype='+osservertype+'&module=CNCPROGMASTER&form=CNCPROGMASTER-form&RefNo='+id, { responseType: 'blob' });
  }
  getdrawmstImagecommon(newData, osservertype, id): Observable<Blob> {
    return this.http.get(this.original_url+'/Common/DownloadFile?url=&fileName='+newData+'&osservertype='+osservertype+'&module=DRAWINGMASTER&form=DRAWINGMASTER-form&RefNo='+id, { responseType: 'blob' });
  }

  downloadImagepmscommon(url, fileenamee, osservertype, RefNo):Observable<Blob>{
    return this.http.get(this.original_url + '/Common/DownloadFile?url='+url+'&fileName='+fileenamee+'&osservertype='+osservertype+'&module=PMS&form=PMS-reply&RefNo='+RefNo, { responseType: "blob" } );
  } 

  downloadImagecommon(url, fileenamee, osservertype, RefNo):Observable<Blob>{
    return this.http.get(this.original_url + '/Common/DownloadFile?url='+url+'&fileName='+fileenamee+'&osservertype='+osservertype+'&module=SOP&form=SOP-form&RefNo='+RefNo, { responseType: "blob" } );
  } 
  downloadImagecncmst(url, fileenamee, osservertype, RefNo):Observable<Blob>{
    return this.http.get(this.original_url + '/Common/DownloadFile?url='+url+'&fileName='+fileenamee+'&osservertype='+osservertype+'&module=CNCPROGMASTER&form=CNCPROGMASTER-form&RefNo='+RefNo, { responseType: "blob" } );
  } 
  downloadImagedrawmst(url, fileenamee, osservertype, RefNo):Observable<Blob>{
    return this.http.get(this.original_url + '/Common/DownloadFile?url='+url+'&fileName='+fileenamee+'&osservertype='+osservertype+'&module=DRAWINGMASTER&form=DRAWINGMASTER-form&RefNo='+RefNo, { responseType: "blob" } );
  } 

  getempDocuments(filename, osservertype, employeeID): Observable<Blob> {
    return this.http.get(this.original_url+'/Common/DownloadFile?url=&fileName='+filename+'&osservertype='+osservertype+'&module=master&form=employee&RefNo='+employeeID, { responseType: 'blob' });
  }
  
}
