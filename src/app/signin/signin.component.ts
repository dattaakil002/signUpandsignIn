import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../api.service';
import { SignService } from '../sign.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  signinData = 'hello';
  signInForm: any;
  signInDisplay: boolean = true;
  pswdAlphabets: boolean = false;
  pswdSpecialDigit: boolean = false;
  pswdLength: boolean = false;
  pswdGood: boolean = false;

  EMAIL_PATTERN = /^\s*\w+([\w_.+]|(-\w+))*\@\w+(((-\w+)|(\w*))|((.\w+)|(\w*)))\.[a-z]{2,}\s*$/;

  constructor(private signService: SignService, private formBuilder: FormBuilder, private toastr: ToastrService, private apiService: ApiService) {
    this.signService.signDetails.subscribe(
      (resp) => {
        this.signinData = resp;
        this.signInDisplay = resp;
        this.signInFormBuilder();
      }
    )
   }

  ngOnInit(): void {
    this.signInFormBuilder();
    // this.testdetails();
  }

  alphabetsOnly(event: any) {
    var charCode = event.keyCode;

    if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode == 8 || charCode == 32)

        return true;
    else
        return false;
  }

  signInFormBuilder(){
    this.signInForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(this.EMAIL_PATTERN)]],
      password: ['']
    })
  }

  passwordCheck(){
    var passwrd = this.signInForm.controls.password.value;
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

  signIn(){
    this.signService.signDetails.next(true);
  }

  submit(){
    console.log(this.signInForm.value);
    let body = this.signInForm.value;

    if(this.signInForm.valid && this.pswdGood){
      this.apiService.postSignInDetails(body).subscribe(resp => {
        if(resp.status == 200 ){
          this.toastr.success('Sign In', resp.message);
        }
        else{
          this.toastr.error('Invalid Error');
        }
      })
    }
    else{
      this.toastr.error('Please enter valid details', 'Invalid Email/Password');
    }
   
  }

}
