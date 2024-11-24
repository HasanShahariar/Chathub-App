import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { NavComponent } from './nav/nav/nav.component';


@NgModule({
  imports: [
    CommonModule,
    ToastrModule.forRoot({  // Configure the ToastrModule globally
      timeOut: 3000,         // Duration for the toast
      positionClass: 'toast-top-right',  // Position of the toast
      preventDuplicates: true
    })
  ],
  declarations: [
    NavComponent
  ],
  exports:[
    NavComponent
  ],
  providers: [
    ToastrService,
    
    // ... other providers
  ],
})
export class SharedModule { }
