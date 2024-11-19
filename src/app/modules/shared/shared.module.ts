import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrModule, ToastrService } from 'ngx-toastr';


@NgModule({
  imports: [
    CommonModule,
    ToastrModule.forRoot({  // Configure the ToastrModule globally
      timeOut: 3000,         // Duration for the toast
      positionClass: 'toast-top-right',  // Position of the toast
      preventDuplicates: true
    })
  ],
  declarations: [],
  providers: [
    ToastrService,
    
    // ... other providers
  ],
})
export class SharedModule { }