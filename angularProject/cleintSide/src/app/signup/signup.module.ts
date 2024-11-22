
import { NgModule } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '../services/users.service'
import { SnackbarService } from '../services/snackbar.service';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { globalConstants } from '../shared/globalConstants';
import { SignupComponent } from './signup.component';
import { MaterialModule } from '../shared/material.module';

@NgModule({
  declarations: [SignupComponent],
  imports: [
    FormBuilder,
    Router,
    UsersService,
    SnackbarService,
    MatDialogRef,
    NgxUiLoaderService,
    globalConstants,
    MaterialModule

  ],
  exports: [SignupComponent]
})
export class SignupModule { }
