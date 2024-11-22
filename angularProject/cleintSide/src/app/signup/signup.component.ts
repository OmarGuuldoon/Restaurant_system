import { HttpClientModule } from '@angular/common/http';  // Ensure HttpClientModule is imported
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '../services/users.service';
import { SnackbarService } from '../services/snackbar.service';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { globalConstants } from '../shared/globalConstants';
import { MaterialModule } from '../shared/material.module';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-signup',
  standalone: true,  // Mark this component as standalone
  imports: [MaterialModule, HttpClientModule,CommonModule,ReactiveFormsModule],  // Import HttpClientModule directly here
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  responseMessage: any;

  constructor(
    private userService: UsersService,
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: SnackbarService,
    private dialogRef: MatDialogRef<SignupComponent>,
    private ngxService: NgxUiLoaderService
  ) {
    console.log('UsersService injected:', this.userService);
  }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.pattern(globalConstants.nameRegex)]],
      email: [null, [Validators.required, Validators.pattern(globalConstants.emailRegex)]],
      contact: [null, [Validators.required, Validators.pattern(globalConstants.contactNumber)]],
      password: [null, [Validators.required]],
      confirmPassword : [null, [Validators.required]]
    });
  }

  handleSubmit() {
    this.ngxService.start();
    const formData = this.signupForm.value;
    const data = {
      name: formData.name,
      email: formData.email,
      contact: formData.contact,
      password: formData.password,
      confirmPassword : formData.confirmPassword
    };
    console.log(data),
    this.userService.signup(data).subscribe({
      next: (response: any) => {
        this.ngxService.stop();
        this.dialogRef.close();
        this.responseMessage = response?.message;
        this.snackBar.openSnackBar(this.responseMessage, '');
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.ngxService.stop();
        this.responseMessage = error.error?.message || globalConstants.genericError;
        this.snackBar.openSnackBar(this.responseMessage, globalConstants.error);
      },
      complete: () => {
        console.log('Signup process completed.');
      },
    });
  }
}
