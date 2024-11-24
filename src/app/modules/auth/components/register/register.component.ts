import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

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
    
 
  
    this.authService.register(this.registerForm.value).subscribe(
      (data)=>{
        
        
        console.log(data);
        
        if(data){
          this.onChangeMode.emit(true)
          this.alert.success('Register successful');
        
        }
        else{
          this.alert.error('Register Failed');
        }
        
      },
      (err)=>{
        
        console.log(err);
        this.alert.error('Register Failed');
      }
    )

    
  }

}
