import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, NgFor, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = "Reactive Form Example"
  honorifics = ['Dr.', 'Mr.', 'Mrs.', 'Ms.'];
  signupForm!: FormGroup;
  forbiddenUsernames = ['john.doe', 'jane.doe']; // Names that cannot be used

  constructor(private formBuilder: FormBuilder) {}
  /*
  Inside ngOnInit(), we setup the 'signupForm' as a new FormGroup with a 'userData' method and initialize the data-bound values for the form.
  */
  ngOnInit() { 
    this.signupForm = new FormGroup({ // 'signupForm' starts as a new FormGroup
      'userData': new FormGroup({ // 'userData' method
        'username': new FormControl(null, [Validators.required, this.forbiddenNames.bind(this)]), // Requires username and prohibits names from 'forbiddenUsernames'
        'email': new FormControl(null, [Validators.required, Validators.email])
      }),
      'honorific': new FormControl('Mrs.'),
      'interests': new FormArray([])
    });

    this.signupForm.statusChanges.subscribe(
      (value) => console.log(value)
    );

    this.signupForm.setValue({ // Setting up default values for the form
      'userData': {
        'username': 'jane.smith',
        'email': 'jane.smith@email.com'
      },
      'honorific': 'male',
      'interests': []
    });
    this.signupForm.patchValue({
      'userData': {
        'username': 'jane.doe',
      }
    });
  }
  /*
  = KNOW THE onSubmit() FUNCTION =

  - this.signupForm.get('interests') accesses the 'interest' field within the 'signupform'.

  - 'as FormArray' explicitly cast 'this.signupForm.get('interests')' to be a 'FormArray'. This allows TS to understand we are working with an array of form controls, so we can access its .controls properties.

  - .controls accesses all the form constrols inside the FormArray. controls is an array where each element represents an individual interest field.

  - interestControls.some(..) uses .some() method on the 'interestControls' array, which checks if at least one element in the array satisfies a given condition.

  - control => !control.value is an arrow function used as a condition for .some(). It checks if 'control.value' is falsy, which would mean the field is empty:
    - control.value represents the current value of each interest control
    - !control.value return true if control.value is empty or null, marking the interest as empty
  
  */
  onSubmit() { 
    const interestControls = (this.signupForm.get('interests') as FormArray).controls;
    const hasEmptyInterests = interestControls.some(control => !control.value);
    if (hasEmptyInterests) {
      return; // Prevent submission if any interest is empty
    }
    else {
      this.signupForm.reset();
    }
  }

  getTouched() {
    return (this.signupForm.get('userData.username') as FormGroup).touched
  }

  getValid() {
    return (this.signupForm.get('userData.username') as FormGroup).valid
  }
  /*
  = KNOW THE onAddInterest() FUNCTION =

  - 'interestArray' has the same function as 'interestControls', but it doesn't include .controls
  
  - interestArray.controls in 'blankInterestCount' gets an array of all controls (interest input fields) within the interestArray

  - .filter(control => !control.value) filters the controls to include only those where control.value is falsy (empty, null, or undefined). This effecively indentifies any blank interest fields

  - .lenght calculates the number of blank interest fields by getting the lenght of the filtered array. Count is stored in 'blankInterestCount'.

  - For the condition check, if there are fewer than three blank interest fields, it allows adding another field. Else, if three or more, it prevents adding an new field.

  - If the condition is met, a new form control with a required validator is created (new FormControl(null, Validators.required); ).

  - interestArray.push(control) adds the new control to interestArray, making it part of the form and displayed to user.

  */
  onAddInterest() {
    const interestArray = this.signupForm.get('interests') as FormArray;
    const blankInterestCount = interestArray.controls.filter(control => !control.value).length;

    if (blankInterestCount < 3) {
      const control = new FormControl(null, Validators.required);
      interestArray.push(control);
    } else {
      console.warn("Cannot add more than 3 blank interests");
    }
  }

  getControls() {
    return (this.signupForm.get('interests') as FormArray).controls
  }

  getNameForbidden() { // It is set to true if any of the forbidden usernames john.doe or jane.doe are used.
    return (this.signupForm.get('userData.username') as FormGroup).errors?.['nameIsForbidden']
  }

  getNameRequired() {
    return (this.signupForm.get('userData.username') as FormGroup).errors?.['required']
  }

  forbiddenNames(control: FormControl): {[s: string]: boolean} | null {
    if (this.forbiddenUsernames.indexOf(control.value) !== -1) {
      return {'nameIsForbidden': true};
    }
    return null;
  }

  forbiddenEmails(control: FormControl): Promise<any> | Observable<any> {
    const promise = new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        if (control.value === 'test@test.com') {
          resolve({'emailIsForbidden': true});
        } else {
          resolve(null);
        }
      }, 1000);
    });
    return promise;
  }
}
