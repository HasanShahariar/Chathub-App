import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import * as signalR from '@microsoft/signalr';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  public hubConnection!: HubConnection;
  public messageSubject: Subject<{ user: string, message: string }> = new Subject();
  public connectionStatusSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  // URL of the SignalR hub endpoint
  public hubUrl = environment.apiUrl + 'chat';

  constructor(
    private http: HttpClient
  ) {

    // if(this.hubConnection?.state === signalR.HubConnectionState.Disconnected){

    this.startConnection();
    // }


  }

  public startConnection(): void {



    const credentials = localStorage.getItem("chathub-credential");
    const parsedCredentials = JSON.parse(credentials);
    var AccessToken = parsedCredentials.AccessToken;

    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${this.hubUrl}?access_token=${AccessToken}`) // Replace with your actual SignalR Hub URL
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect() // Enable automatic reconnection
      .build();


    if (this.hubConnection?.state === signalR.HubConnectionState.Disconnected) {

      this.hubConnection
        .start()
        .then(() => {
          console.log('SignalR Connected');
          this.connectionStatusSubject.next(true);
        })
        .catch((err) => {

          console.error('SignalR Connection Error: ', err);
          this.connectionStatusSubject.next(false);
        });
    }

    this.addReceiveMessageListener();

  }

  public addReceiveMessageListener(): void {

    this.hubConnection.on('ReceiveMessage', (user: string, message: string) => {
      this.messageSubject.next({ user, message });
    });
  }

  public addReconnectionListeners(): void {
    // Reconnection events
    this.hubConnection.onreconnecting((error) => {
      console.warn('Reconnecting...', error);
      this.connectionStatusSubject.next(false);
    });

    this.hubConnection.onreconnected((connectionId) => {
      console.log('Reconnected. Connection ID:', connectionId);
      this.connectionStatusSubject.next(true);
    });

    this.hubConnection.onclose((error) => {
      console.error('SignalR connection closed', error);
      this.connectionStatusSubject.next(false);
      // Optionally, try to restart the connection after some delay
      setTimeout(() => this.startConnection(), 5000);
    });
  }

  // public sendMessage(connectionId: string, message: string): Observable<any> {
  //   var obj = {
  //     ConnectionId: connectionId,
  //     Message:message
  //   }


  //   return this.http.post<any>(environment.apiUrl+"api/Chat/SendMessage", obj);
  // }

  public getAllUsers(): Observable<any> {
    return this.http.get<any>(environment.apiUrl + "api/Users/GetAll");
  }
  public getChatHistory(senderId,receiverId): Observable<any> {
    return this.http.get<any>(environment.apiUrl + `api/Chat/GetAll?SenderId=${senderId}&ReceiverId=${receiverId}`);
  }

  public sendMessage(userId: any, message: string): void {
    
    if (this.hubConnection?.state === 'Connected') {
        this.hubConnection
            .invoke('SendMessage', userId, message)  // Send both 'userId' and 'message'
            .catch((err) => console.error('Error sending message: ', err));
    } else {
        console.warn('Cannot send message. SignalR is not connected.');
    }
}

  public getMessage(): Observable<{ user: string, message: string }> {

    return this.messageSubject.asObservable();
  }

  public getConnectionStatus(): Observable<boolean> {
    return this.connectionStatusSubject.asObservable();
  }


}
