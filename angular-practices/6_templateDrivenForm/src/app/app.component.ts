import { Component, ViewChild } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { randomInt } from 'crypto';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, NgIf, NgFor],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Template Driven Form';
  @ViewChild('f', { static: false })
  signupForm!: NgForm;
  defaultQuestion = 'street';
  answer = '';
  honorifics = ['Dr', 'Mr.', 'Mrs.', 'Ms.'];
  user = {
    username: '',
    email: '',
    securityQuestion: '',
    answer: '',
    honorific: ''
  };
  submitted = false;

  suggestUserName() {
    const suggestedName = 'Superuser';
    this.signupForm.form.patchValue({
      userData: {
        username: suggestedName
      }
    });
  }
  
  onSubmit() {
    this.submitted = true;
    this.user.username = this.signupForm.value.userData.username;
    this.user.email = this.signupForm.value.userData.email;
    this.user.securityQuestion = this.signupForm.value.security;
    this.user.answer = this.signupForm.value.questionAnswer;
    this.user.honorific = this.signupForm.value.honorific;
    this.signupForm.reset();
  }
}
