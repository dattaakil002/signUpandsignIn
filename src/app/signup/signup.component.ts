import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../api.service';
import { SignService } from '../sign.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupData = 'hello';
  signUpForm: any;
  signUpDisplay: boolean = true;
  hello = 'hello';
  pswdAlphabets: boolean = false;
  pswdSpecialDigit: boolean = false;
  pswdLength: boolean = false;
  pswdGood: boolean = false;

  EMAIL_PATTERN = /^\s*\w+([\w_.+]|(-\w+))*\@\w+(((-\w+)|(\w*))|((.\w+)|(\w*)))\.[a-z]{2,}\s*$/;

  constructor(private signService: SignService, private formBuilder: FormBuilder, private toastr: ToastrService, private apiService: ApiService) {
    this.signService.signDetails.subscribe(
      (resp) => {
        this.signupData = resp;
        this.signUpDisplay = resp;
        this.signUpFormBuilder();
      }
    )
   }

  ngOnInit(): void {
    this.signUpFormBuilder();
    console.log(this.hello.split('').length);
    
  }

  alphabetsOnly(event: any) {
    var charCode = event.keyCode;

    if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode == 8 || charCode == 32)

        return true;
    else
        return false;
  }

  signUpFormBuilder(){
    this.signUpForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(this.EMAIL_PATTERN)]],
      password: ['']
    })
  }

  passwordCheck(){
    var passwrd = this.signUpForm.controls.password.value;
    this.pswdAlphabets = false;
    this.pswdSpecialDigit = false;
    this.pswdLength = false;
    if(passwrd.length > 0){
      let alphabets = 0;
      var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
      var regex = /\d+/g;
      var passwordarr = passwrd.split('');
      passwordarr.forEach((element: any) => {
        if((element.match("^[a-zA-Z]*$"))){
          alphabets++;
        }
      });
      if(alphabets < 8 ) this.pswdAlphabets = true;
      else if(!(format.test(passwrd)) || !(passwrd.match(regex))) this.pswdSpecialDigit = true;
      else if(passwrd.length < 15) this.pswdLength = true;
      else {
        this.pswdGood = true
      }
      console.log(passwrd);
      console.log(alphabets);

    }
  }

  signUp(){
    this.signService.signDetails.next(false);
  }

  submit(){
    console.log(this.signUpForm.controls.email.valid);
    let body = this.signUpForm.value;

    if(this.signUpForm.valid && this.pswdGood){
      this.apiService.postSignUpDetails(body).subscribe(resp => {
        if(resp.status == 200 ){
          this.toastr.success('Sign Up', resp.message);
        }
        else{
          this.toastr.error('Invalid Error');
        }
      })
    }
    else{
      this.toastr.error('Please enter valid details');
    }

   
  }
}
