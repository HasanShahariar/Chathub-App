import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChatService } from '../../services/chat.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { AuthService } from '../../../auth/services/auth.service';
import { SharedService } from '../../../shared/services/shared.service';
import { environment } from '../../../../environment';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { QuillImageResize } from 'quill-image-resize-module';  // Import Image Resize Module
import Quill from 'quill';





@Component({
  selector: 'app-chat-screen',
  templateUrl: './chat-screen.component.html',
  styleUrls: ['./chat-screen.component.css'],
  animations: [
    trigger('slideDownUp', [
      state('void', style({
        transform: 'translateY(-15%)',
        opacity: 0
      })),
      state('*', style({
        transform: 'translateY(0)',
        opacity: 1
      })),
      transition(':enter', [
        animate('300ms ease-out')
      ]),
      transition(':leave', [
        animate('300ms ease-in')
      ])
    ])
  ]
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
  myUserId: any;

  @ViewChild('chatContainer') chatContainer!: ElementRef;
  chatFriend: any;
  isChatScreen: boolean = null;
  isMobileScreen: boolean;
  showProfiles: boolean = false;
  isShowProfile: boolean;
  imgUrl = environment.imgUrl
  defaultImgUrl = '../../../../../assets/media/300-1.jpg';
  searchKey: any = null;
  activeUsers: any[] = [];
  activeUsersCount: number;
  sanitizedContent: SafeHtml;




  editorOptions = {
    modules: {
      toolbar: [
        // [{ 'header': [1, 2, false] }],  
        // ['image', 'code-block']    
               
        ['bold', 'italic', 'underline'],  
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],        

      ],
      imageResize: {
        displaySize: true, // Optional: display resize handles on images
      },
      emoji: true
    },
    placeholder: 'Compose an epic...',
    theme: 'snow'
  };

  constructor(
    private _service: ChatService,
    private authService: AuthService,
    private sharedService: SharedService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    // Quill.register('modules/imageResize', QuillImageResize);
    this.initImageResize();

    this._service.startConnection();
    if (window.innerWidth <= 768) {
      this.isMobileScreen = true;
      this.isChatScreen = false
    } else {
      this.isMobileScreen = false;
    }

    this.sharedService.showProfileSubject$.subscribe((value) => {
      this.isShowProfile = value; // Update whenever Subject emits a new value
    });



    this.getMyUserId()

    this.receiveMessage()
    this._service.getActiveUsers()
    
    
    this._service.activeUsers$.subscribe(users => {
      
      this.activeUsers = users;
      
      this.activeUsers = this.activeUsers.filter(user => user !== this.myUserId.toString());
      this.activeUsersCount = this.activeUsers.length;
    });
    
    this._service.getActiveUsers()
  }




  initImageResize(): void {
    // Listen for image drop event and resize images to 500x500px
    const editor = document.querySelector('.quill-editor .ql-editor');

    if (editor) {
      editor.addEventListener('drop', (e: any) => {
        const files = e.dataTransfer.files;
        const image = files[0];

        if (image && image.type.includes('image')) {
          const reader = new FileReader();
          reader.onload = () => {
            const img = new Image();
            img.src = reader.result as string;
            img.onload = () => {
              const quill = this.editorOptions as any;  // Access the Quill editor
              const range = quill.getSelection();
              const imageUrl = img.src;

              // Insert image with fixed size 500x500px
              const imageHtml = `<img src="${imageUrl}" width="500" height="500">`;
              quill.clipboard.dangerouslyPasteHTML(range.index, imageHtml);
            };
          };
          reader.readAsDataURL(image);
        }
      });
    }
  }



  getSanitizedHtml(html: string): SafeHtml {
    debugger
    var  gfgfg = this.sanitizer.bypassSecurityTrustHtml(html);
    return gfgfg
  }


  getActiveStatus(userId){
    
    if(this.activeUsers.includes(userId.toString())){
      return true;
    }
    else{
      return false
    }
  }



  receiveMessage() {
    this._service.getMessage().subscribe((msg) => {
      if (this.chatFriend.Id == Number(msg.user)) {
        var message = {
          Messages: msg.message,
          ReceiverId: this.myUserId,
          SenderId: this.receiverId,
          User: msg.user
        }
        this.chatHistory.push(message);
        this.scrollToBottom();
      }

    });
    this._service.connectionStatusSubject.subscribe(
      (data) => {
        this.isConnected = data;
      }
    )
  }


  toggleProfiles(event: Event) {
    event.stopPropagation();
    this.showProfiles = !this.showProfiles;
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event): void {
    this.showProfiles = false;
  }



  getMyUserId() {
    const storedData = localStorage.getItem("chathub-credential");

    if (storedData) {

      const parsedData = JSON.parse(storedData);
      this.myUserId = parsedData.UserId;
      this.getAllUsers(this.myUserId)

    } else {
      console.warn('No credentials found in localStorage');
    }
  }

  getFilteredUsers(event) {

    this.searchKey = event.target.value;
    this.getAllUsers();
  }


  getAllUsers(myUserId?) {

    this._service.getAllUsers(this.searchKey).subscribe(
      (data) => {

        this.userList = data.body.Data;
        this.userList = this.userList.filter(user => user.Id !== myUserId);

        var chatFriend = sessionStorage.getItem('chatFriend');

        if (chatFriend) {
          this.chatFriend = JSON.parse(chatFriend);

        }
        else {

          this.chatFriend = this.userList[0];
        }

        this.getChatHistory(this.chatFriend.Id)
        console.log(this.userList);
      },
      (err) => {
        console.log(err);
      }
    )
  }

  onContentChange(content: any) {
    return this.sanitizedContent = this.sanitizer.bypassSecurityTrustHtml(content);
  }




  sendMessage(): void {
    
    if(this.message.trim() === ''){
      return
    }
    this.getChatHistory(this.receiverId)
    if (this.receiverId && this.message) {
      this._service.sendMessage(this.receiverId, this.message);
      this.message = ''; // Clear the input after sending
    }
  }


  selectChatFriend(chatFriend) {
    sessionStorage.setItem('chatFriend', JSON.stringify(chatFriend));
    this.chatFriend = chatFriend;
    this.getChatHistory(chatFriend.Id)
    this.isChatScreen = true;
  }

  goToList() {
    this.isChatScreen = false;
  }


  getChatHistory(chatFriendId) {
    this.receiverId = chatFriendId;
    this._service.getChatHistory(this.myUserId, chatFriendId).subscribe(
      (data) => {
        this.chatHistory = data.Data;
        this.scrollToBottom();
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
  logOut() {
    this.authService.logout()
  }

}
