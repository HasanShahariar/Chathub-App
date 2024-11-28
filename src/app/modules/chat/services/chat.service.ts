import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import * as signalR from '@microsoft/signalr';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environment';
import { devNull } from 'os';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  public hubConnection!: HubConnection;
  public messageSubject: Subject<{ user: string, message: string }> = new Subject();
  public connectionStatusSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  // public activeUsers: Set<string> = new Set<string>();
  public activeUsers: any

  private activeUsersSubject = new BehaviorSubject<string[]>([]);
  public activeUsers$ = this.activeUsersSubject.asObservable();
  // URL of the SignalR hub endpoint
  public hubUrl = environment.apiUrl + 'chat';

  constructor(
    private http: HttpClient
  ) {
    
    this.startConnection();
    // this.listenToUserStatus();
  }

  logout() {
    this.hubConnection.invoke('Logout').catch((err) => {
      console.error('Error during logout: ', err);
    });
  }
  

  public startConnection(): void {



    if (typeof localStorage !== 'undefined') {
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
            this.getActiveUsers() 
          })
          .catch((err) => {

            console.error('SignalR Connection Error: ', err);
            this.connectionStatusSubject.next(false);
          });
      }

      this.addReceiveMessageListener();
    } else {
      console.error("localStorage is not available.");
    }

  }

  // private listenToUserStatus(): void {
  //   this.hubConnection.on('UserStatusChanged', (userId: string, isActive: boolean) => {
  //     // let currentUsers = this.activeUsersSubject.value;

  //     let currentUsers = [...this.activeUsersSubject.value,userId];
  //     // currentUsers = currentUsers.filter(user => user !== userId);

  //     // if (isActive && !currentUsers.includes(userId)) {
  //     //   currentUsers = [...currentUsers];
  //     // } else if (!isActive) {
  //     //   currentUsers = currentUsers.filter(user => user !== userId);
  //     // }

  //     this.activeUsersSubject.next(currentUsers); // Update the BehaviorSubject
  //   });
  // }

  // public getActiveUsers(): void {
  //   
  //   this.hubConnection.invoke('GetActiveUsers').then((users: string[]) => {
  //     this.activeUsersSubject.next(users); // Set the initial active users list
  //   });
  // }

  getActiveUsers() {
    
    this.hubConnection.invoke('GetActiveUsers').catch((err) => {
      console.error('Error retrieving active users: ', err);
    });
  
    this.hubConnection.on('ReceiveActiveUsers', (activeUsers: string[]) => {
      
      
      console.log('Active Users: ', activeUsers);
      this.activeUsersSubject.next(activeUsers);
      // this.activeUsers = activeUsers; // Update your local active users list
    });
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



  public getAllUsers(searchKey?): Observable<any> {
    let params = new HttpParams();

    if (searchKey != null) {
      params = params.append('SearchKey', searchKey);
    }

    return this.http.get<any>(environment.apiUrl + "api/Users/GetAll", {
      observe: 'response',
      params,
    });
  }

  getUserById(id) {
    return this.http.get<any>(environment.apiUrl + "api/Users/GetById?UserId=" + id);

  }

  public getChatHistory(senderId, receiverId): Observable<any> {
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
