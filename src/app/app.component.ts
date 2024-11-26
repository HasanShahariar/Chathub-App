import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [MessageService], // Provide MessageService here

})
export class AppComponent {
  constructor(private messageService: MessageService) {}
  title = 'ChatHub-App';
  showSuccess() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Operation Successful!' });
  }
}
