import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { NgIf, NgForOf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chat-screen',
  templateUrl: './chat-screen.component.html',
  styleUrls: ['./chat-screen.component.css']
})
export class ChatScreenComponent implements OnInit {

  public user: any = 2;
  public message: string = '';
  public messages: any = [];
  connectionStatusSubscription: Subscription | undefined;
  isConnected: boolean;
  userList: any;
  receiverId: any;
  chatHistory: any;
  myUserId: void;

  @ViewChild('chatContainer') chatContainer!: ElementRef;

  constructor(
    private _service: ChatService,
    // private authService: AuthService
  ) { }

  ngOnInit(): void {
    
    this.getMyUserId()
    
    this._service.getMessage().subscribe((msg) => {
      
      this.messages.push(msg);
      
debugger
      var message = {
        Messages: msg.message,
        ReceiverId: this.myUserId,
        SenderId: this.receiverId,
        User:msg.user
      }
      this.chatHistory.push(message);
      this.scrollToBottom();
    });
    this._service.connectionStatusSubject.subscribe(
      (data) => {
        this.isConnected = data;
      }
    )

    
  }

  

  getMyUserId() {
    const storedData = localStorage.getItem("chathub-credential");

    if (storedData) {
      // Parse the data from JSON string to an object
      const parsedData = JSON.parse(storedData);

      // Access the UserId (assuming 'UserId' is a property in the stored data)
      const myUserId = parsedData.UserId;
      this.myUserId = parsedData.UserId;
      this.getAllUsers(myUserId)

    } else {
      console.warn('No credentials found in localStorage');
    }
  }


  getAllUsers(myUserId) {
    this._service.getAllUsers().subscribe(
      (data) => {
        this.userList = data.Data;
        this.userList = this.userList.filter(user => user.Id !== myUserId);

        this.getChatHistory(this.userList[0].Id)

        console.log(this.userList);
      },
      (err) => {
        console.log(err);
      }
    )
  }

  
  sendMessage(): void {

    this.getChatHistory(this.receiverId)
    
    
    if (this.receiverId && this.message) {
      this._service.sendMessage(this.receiverId,this.message);
      this.message = ''; // Clear the input after sending
    }
  }


  getChatHistory(receiverId) {
    
    this.receiverId = receiverId;
    this._service.getChatHistory(this.myUserId,receiverId).subscribe(
      (data) => {
        
        this.chatHistory = data.Data;

        console.log(this.chatHistory);
      },
      (err) => {
        console.log(err);
      }
    )
  }



  ngOnDestroy(): void {
    // Optional: Add logic to stop the connection when the component is destroyed
  }

  scrollToBottom() {
    
    try {
      setTimeout(() => {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      }, 1);
          } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }

}
