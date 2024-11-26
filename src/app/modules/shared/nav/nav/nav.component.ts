import { Component, HostListener, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { AuthService } from '../../../auth/services/auth.service';
import { MessageService } from 'primeng/api';
import { SharedService } from '../../services/shared.service';
import { ChatService } from '../../../chat/services/chat.service';
import { environment } from '../../../../environment';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
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
  ],
})
export class NavComponent implements OnInit {
  showProfiles: boolean = false;
  profileImage: any;

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private sharedService: SharedService,
    private chatService: ChatService
  ) { }

  ngOnInit() {
    const storedData = localStorage.getItem("chathub-credential");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      this.getUserById(parsedData.UserId)
    }
  }

  getUserById(id){
    this.chatService.getUserById(id).subscribe(
      (data)=>{
        console.log(data);
       
        
      
        
        
        this.profileImage = environment.imgUrl+data.ProfileImageUrl
      },
      (err)=>{
        console.log(err);
        
      }
    )
  }

  toogleChatlistAndProfile(value){
    this.sharedService.updateValue(value);
  }
  

  toggleProfiles(event: Event) {
    event.stopPropagation();
    this.showProfiles = !this.showProfiles;
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event): void {
      this.showProfiles = false;
  }

  logOut(){
    this.chatService.logout()
    this.authService.logout()
   }

}
