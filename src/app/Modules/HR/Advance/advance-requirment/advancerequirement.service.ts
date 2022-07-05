import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpRequest, HttpEvent} from '@angular/common/http';
import {Observable} from "rxjs";

import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdvancerequirementService {
  original_url=environment.baseUrl;
  constructor(private http: HttpClient) { }

  // file from event.target.files[0]
  uploadFile(url: string, file: File): Observable<HttpEvent<any>> {

    let formData = new FormData();
    formData.append('upload', file);

    let params = new HttpParams();

    const options = {
      params: params,
      reportProgress: true,
    };

    const req = new HttpRequest('POST', url, formData, options);
    return this.http.request(req);
  }
  downloadNoteReceipt(foldername:string,  filename: string):Observable<Blob>{    
    return this.http.get(this.original_url + `/Master/upload/DownloadFile?filename=` + filename+'&foldername='+foldername, { responseType: "blob" } );
  }
}