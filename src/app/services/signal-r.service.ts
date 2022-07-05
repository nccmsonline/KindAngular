import { Injectable } from '@angular/core';
import * as signalR from "@aspnet/signalr";
import { Subject, Observable } from 'rxjs';
import { environmentNotification } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  original_url=environmentNotification.baseUrl;
  private message$: Subject<Message>;
  private connection: signalR.HubConnection;

  constructor() {
    // this.message$ = new Subject<Message>();
    // this.connection = new signalR.HubConnectionBuilder()
    // .withUrl(this.original_url+ "/notificationHub")
    // .build();

    // this.connect();
  }

  // private connect() {
  //   this.connection.start().catch(err => console.log(err));

  //   this.connection.on('SendMessage', (message) => {
  //     this.message$.next(message);
  //     console.log("Singular ", message);
  //   });
  // }

  // public getMessage(): Observable<Message> {
  //   return this.message$;
  // }

  // public disconnect() {
  //   this.connection.stop();
  // }
  
}


export interface Message {
  val1: string;
  val2: string;
  val3: string;
  val4: string;
}