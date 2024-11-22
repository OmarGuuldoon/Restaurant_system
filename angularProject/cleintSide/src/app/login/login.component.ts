  import { Component, OnInit } from '@angular/core';
  import { UsersService } from '../services/users.service';
  import { FormBuilder, Validators,ReactiveFormsModule } from '@angular/forms';
  import { SnackbarService } from '../services/snackbar.service';
  import { NgxUiLoaderService } from 'ngx-ui-loader';
  import { RouterModule } from '@angular/router';
  import { Router } from '@angular/router';
  import { MatDialogRef } from '@angular/material/dialog';
  import { globalConstants } from '../shared/globalConstants';
  import { MaterialModule } from '../shared/material.module';
  import { HttpClientModule } from '@angular/common/http';
  import { CommonModule } from '@angular/common';
  import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
  import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
  import { RouterLink } from '@angular/router';
  @Component({
    selector: 'app-login',
    standalone: true,
    imports: [RouterLink,MaterialModule,HttpClientModule,CommonModule,ReactiveFormsModule,ForgotPasswordComponent,RouterModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
  })
  export class LoginComponent implements OnInit {

    loginForm : any = FormBuilder;
    responseMessage :any;
    constructor(
      private userService :UsersService,
      private formBuilder :FormBuilder,
      private snackbar :SnackbarService,
      private ngxservice :NgxUiLoaderService,
      private router :Router,
      private dialogRef : MatDialogRef<LoginComponent>,
      private dialog : MatDialog
    ){}
    ngOnInit(): void {
        this.loginForm = this.formBuilder.group({
          email :[null,[Validators.required,Validators.pattern(globalConstants.emailRegex)]],
          password :[null,[Validators.required]]
        })
    }

    loginHandler(){
      this.ngxservice.start();
      const formData = this.loginForm.value;
      const Data = {
        email : formData.email,
        password : formData.password
      }
      this.userService.userLogin(Data).subscribe({
        next : (response :any) => {
          this.ngxservice.stop();
          this.responseMessage = response?.message,
          this.snackbar.openSnackBar(this.responseMessage ,'');
          this.dialogRef.close();
          localStorage.setItem('token',response.token);
          this.router.navigate(['/cafe/dashboard']).then(success => {
            if (success) {
              console.log('Navigation successful');
            } else {
              console.error('Navigation failed');
            }
          });
        },
        error : (error) => {
          this.ngxservice.stop();
          this.responseMessage = error.error.message || globalConstants.genericError;
          this.snackbar.openSnackBar(this.responseMessage , globalConstants.error)
          this.dialogRef.close();
        },
        complete :() => {
          console.log("login succesfully");
        }
      })
    }
    forgotpasswordHandler() {
      console.log('forget password button is working fine');
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = "550px",
      this.dialog.open(ForgotPasswordComponent,dialogConfig);
      this.dialogRef.close();   
    }
  }
