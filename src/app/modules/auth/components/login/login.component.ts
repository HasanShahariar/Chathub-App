import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService:AuthService,
    private alert: ToastrService,
    private router: Router
    ) { }

  ngOnInit() {
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

  onSubmit(){
    
 
    var userInfo = {
      Username: this.loginForm.value.userName,
      Password: this.loginForm.value.password,
    }
    this.authService.authenticate(userInfo).subscribe(
      (data)=>{
        
        console.log(data);
        
        if(data){
          this.alert.success('Login successful');
          localStorage.setItem("chathub-credential",JSON.stringify(data))
          this.router.navigate(['chat']);
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
