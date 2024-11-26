import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;
  returnUrl: any;
  @Output() onChangeMode = new EventEmitter<boolean>();

  constructor(
    private formBuilder: FormBuilder,
    private authService:AuthService,
    private alert: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
    
    ) { }

  ngOnInit() {
    this.returnUrl = 'chat'
    
    var data = localStorage.getItem("chathub-credential")
    if(data){
      this.router.navigate(["chat"])
    }
    this.createForm();
  }
  createForm() {
    this.registerForm = this.formBuilder.group({
      fullName: ['', Validators.required],
      userName: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  goToLogin(){
    this.onChangeMode.emit(true)
  }

  onSubmit(){
    if(this.registerForm.invalid){
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Provide valid information'});
      return;
    }
    
    this.authService.register(this.registerForm.value).subscribe(
      (data)=>{
        console.log(data);
        if(data){
          this.onChangeMode.emit(true)
          this.messageService.add({severity: 'success', summary: 'Success', detail: 'Registration Successful'});

        
        }
        else{
          this.alert.error('Register Failed');
          this.messageService.add({severity: 'error', summary: 'Error', detail: 'Register Failed'});
        }
        
      },
      (err)=>{    
        console.log(err);
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Register Failed'});
      }
    )

    
  }

}
