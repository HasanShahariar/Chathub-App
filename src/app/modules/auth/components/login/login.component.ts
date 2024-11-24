import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
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
    private route: ActivatedRoute,
    
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
    
 
    
    this.authService.authenticate(this.loginForm.value).subscribe(
      (data)=>{
        
        
        console.log(data);
        
        if(data){
          this.router.navigate([this.returnUrl]);
          this.alert.success('Login successful');
        
        }
        else{
          this.alert.error('Login Failed');
        }
        
      },
      (err)=>{
        
        console.log(err);
        this.alert.error('Login Failed');
      }
    )

    
  }


}
