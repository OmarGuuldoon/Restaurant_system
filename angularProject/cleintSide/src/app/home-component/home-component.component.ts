import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MaterialModule } from '../shared/material.module';
import { BestsellerComponent } from '../bestseller/bestseller.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SignupComponent } from '../signup/signup.component';
import { HttpClientModule } from '@angular/common/http';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { LoginComponent } from '../login/login.component';
import { RouterLink } from '@angular/router';
import { UsersService } from '../services/users.service';
import { response } from 'express';
import { Router } from '@angular/router';





@Component({
  selector: 'app-home-component',
  standalone: true,
  imports: [RouterLink,MatIconModule,MaterialModule,BestsellerComponent,SignupComponent,HttpClientModule],
  templateUrl: './home-component.component.html',
  styleUrl: './home-component.component.scss'
})
export class HomeComponentComponent implements OnInit  {

  constructor(private dailog : MatDialog,
    private userService : UsersService,
    private router : Router,
  ){}

  ngOnInit(
  ): void {
    if(localStorage.getItem('token') != null) {
      this.userService.checkToken().subscribe({
        next : (response : any)=> {
          this.router.navigate(['cafe/dashboard']);
        },
        error : (error : any) => {
          console.log(error);
        }
      })
    }
  }
  singupHandler()  {
    console.log("sign up handler button is working fine");
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "550px",
    this.dailog.open(SignupComponent,dialogConfig);

  }
  loginHandler(){
    console.log("login handler is working fine");
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width ="550px";
    this.dailog.open(LoginComponent,dialogConfig);
  }
  forgotpasswordHandler() {
    console.log('forget password button is working fine');
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "550px",
    this.dailog.open(ForgotPasswordComponent,dialogConfig);
  }
}
