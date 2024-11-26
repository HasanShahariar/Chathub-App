import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { NavComponent } from './nav/nav/nav.component';
import { ToastModule } from 'primeng/toast';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ToastrModule.forRoot({  // Configure the ToastrModule globally
      timeOut: 3000,         // Duration for the toast
      positionClass: 'toast-top-right',  // Position of the toast
      preventDuplicates: true
    }),
    ToastModule
  ],
  declarations: [
    NavComponent
  ],
  exports:[
    NavComponent,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [
    ToastrService,
    ReactiveFormsModule,
    FormsModule
    
    // ... other providers
  ],
})
export class SharedModule { }
