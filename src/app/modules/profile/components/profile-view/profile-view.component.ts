import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../../chat/services/chat.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from '../../services/profile.service';
import { environment } from '../../../../environment';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.css']
})
export class ProfileViewComponent implements OnInit {
  user: any;
  profileForm: FormGroup;
  profileImage: string = null; // Default image
  defaultImgUrl = '../../../../../assets/media/300-1.jpg';


  constructor(
    private fb: FormBuilder,
    private chatService: ChatService,
    private _service: ProfileService
  ) { }

  ngOnInit() {
    this.createprofileForm()
    
    const storedData = localStorage.getItem("chathub-credential");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      this.getUserById(parsedData.UserId)
    }
     // Initialize the form
     
  }

  createprofileForm(){
    this.profileForm = this.fb.group({
      Id: null,
      FullName: '',
      UserName: '',
      Email: '',
      MobileNo: '',
      ProfileImageUrl:null
    });
  }

  getUserById(id){
    this.chatService.getUserById(id).subscribe(
      (data)=>{
        console.log(data);
        this.user = data;
        
        this.profileForm.patchValue(data)
        
        this.profileForm.value.ProfileImageUrl = environment.imgUrl+data.ProfileImageUrl
        this.profileImage = environment.imgUrl+(data.ProfileImageUrl?data.ProfileImageUrl:this.defaultImgUrl)
      },
      (err)=>{
        console.log(err);
        
      }
    )
  }

 


  // Handle image upload
  onImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.result) {
          this.profileImage = reader.result as string; // Update the profile image preview
        }
      };

      reader.readAsDataURL(file); // Convert the file to a Data URL
      this.onSubmit()
    }
  }

  // Submit form data including the image
  onSubmit(): void {
    
    if (this.profileForm.invalid) {
      return;
    }

    // Create a FormData object
    const formData = new FormData();
    
    // Append form values to FormData
    
    formData.append('Id', this.profileForm.value.Id);
    formData.append('FullName', this.profileForm.value.FullName);
    formData.append('UserName', this.profileForm.value.UserName);
    formData.append('Email', this.profileForm.value.Email);
    formData.append('MobileNo', this.profileForm.value.MobileNo);

    // Append the image if available
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    if (fileInput?.files?.[0]) {
      formData.append('ProfileImage', fileInput.files[0]);
    }

    this._service.updateUser(formData).subscribe(
      (data)=>{
        console.log(data);
      },
      (err)=>{
        console.log(err);
      }
    )
  }

}
