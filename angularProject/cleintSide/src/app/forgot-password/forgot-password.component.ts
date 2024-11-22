import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { UsersService } from '../services/users.service';
import { SnackbarService } from '../services/snackbar.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { globalConstants } from '../shared/globalConstants';
import { response } from 'express';
import { MaterialModule } from '../shared/material.module';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule,HttpClientModule,CommonModule,MaterialModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: any = FormGroup;
  responseMessage : any;

  constructor(
    private userService: UsersService,
    private formBuilder: FormBuilder,
    private snackbar: SnackbarService,
    private router: Router,
    private dailogRef: MatDialogRef<ForgotPasswordComponent>,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.pattern(globalConstants.emailRegex)]]
    });
  }

  handleForgotAction() {
    this.ngxService.start();
    const formData = this.forgotPasswordForm.value;
    const data = {
      email: formData.email
    }
    this.userService.forgotPassword(data).subscribe({
      next : (response : any) => {
        this.ngxService.stop();
        this.dailogRef.close();
        this.responseMessage = response?.message;
        this.snackbar.openSnackBar(this.responseMessage,'');
        this.router.navigate(['/']);
      },
      error : (error) => {
        this.ngxService.stop();
        this.dailogRef.close();
        this.responseMessage = error.error.message || globalConstants.genericError;
        this.snackbar.openSnackBar(this.responseMessage,globalConstants.error);
      },
      complete : () => {
        console.log("Forgotpassword completed succesfully")
      }
    })
  }
}
