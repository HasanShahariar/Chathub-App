import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatRoutingModule } from './chat-routing.module';
import { ChatScreenComponent } from './components/chat-screen/chat-screen.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    ChatScreenComponent
  ],
  imports: [
    CommonModule,
    ChatRoutingModule,
    FormsModule  
  ],
  exports:[
    ChatScreenComponent
  ]
})
export class ChatModule { }
