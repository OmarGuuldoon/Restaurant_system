import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { SnackbarService } from '../../services/snackbar.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatDialogRef } from '@angular/material/dialog';
import { response } from 'express';
import { globalConstants } from '../../shared/globalConstants';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/material.module';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule,MaterialModule,ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent implements OnInit{

  changePasswordForm : any =FormGroup;
  responseMessage : any;
  constructor(
    private formBuilder : FormBuilder,
    private userService : UsersService,
    private snackbar : SnackbarService,
    private ngxService : NgxUiLoaderService,
    private dialogRef : MatDialogRef<ChangePasswordComponent>
  ){

  }
  ngOnInit(): void {
      this.changePasswordForm = this.formBuilder.group({
        oldPassword : [null,[Validators.required]],
        newPassword : [null,[Validators.required]],
        confirmPassword : [null,[Validators.required]]
      })
  }

  validateSubmit(){
    if(this.changePasswordForm.controls['newPassword'].value != this.changePasswordForm.controls['confirmPassword'].value)
    {
      return true

    }
    else {
      return false
    }
  }

  handleChangePassword(){
    this.ngxService.start();
    var formData = this.changePasswordForm.value;
    const Data = {
      oldPassword : formData.oldPassword,
      newPassword : formData.newPassword,
      confirmPassword : formData.confirmPassword
    }
    console.log(Data);

    this.userService.changePassword(Data).subscribe({
      next : (response : any) => {
        this.ngxService.stop();
        this.responseMessage = response?.message;
        this.dialogRef.close();
        this.snackbar.openSnackBar(this.responseMessage,'success');
      },
      error : (error : any) => {
        this.ngxService.stop();
        this.responseMessage = error.error.message;
        this.dialogRef.close();
        this.snackbar.openSnackBar(this.responseMessage, globalConstants.genericError)
      },
      complete :() => {
        this.snackbar.openSnackBar(this.responseMessage, globalConstants.error)
      }
    })
  }
}
