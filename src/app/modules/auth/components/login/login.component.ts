import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  returnUrl: any;
  @Output() onChangeMode = new EventEmitter<boolean>();


  constructor(
    private formBuilder: FormBuilder,
    private authService:AuthService,
    private alert: ToastrService,
    private router: Router,
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
    this.loginForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  goToRegister(){
    this.onChangeMode.emit(false)
  }

  onSubmit(){
    
    if(this.loginForm.invalid){
      
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Provide valid information'});
      return;
    }
 
    
    this.authService.authenticate(this.loginForm.value).subscribe(
      (data)=>{
        
        debugger
        console.log(data);
        
        if(data){
          this.router.navigate([this.returnUrl]);
          this.messageService.add({severity: 'success', summary: 'Success', detail: 'Successfully logged in'});

        
        }
        else{
          this.messageService.add({severity: 'error', summary: 'Error', detail: 'Login Failed'});

        }
        
      },
      (err)=>{
        
        console.log(err);
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Login Failed'});
      }
    )

    
  }


}
