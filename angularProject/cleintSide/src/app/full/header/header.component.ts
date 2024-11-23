import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmLogoutDailogComponent } from '../../dailog/confirm-logout-dailog/confirm-logout-dailog.component';
import { ChangePasswordComponent } from '../../dailog/change-password/change-password.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatMenuModule,MatIconModule,MatButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  role: any;
  constructor(private router: Router,
    private dialog: MatDialog) {

  }

  ngOnInit(): void{
    console.log("header is loaded");
  }


  logout(){
    const dialogConfig =new MatDialogConfig();
    dialogConfig.data = {
      message :"Logout"
    }
    const dialogRef = this.dialog.open(ConfirmLogoutDailogComponent,dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((user) =>{
      dialogRef.close();
      localStorage.clear();
      this.router.navigate(['/']);
    })
  }

  changePassword(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width ='550px';
    this.dialog.open(ChangePasswordComponent,dialogConfig);
  }
}
