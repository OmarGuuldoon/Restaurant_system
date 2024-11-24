import { Component, OnInit } from '@angular/core';
import { UsersService } from '../services/users.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../services/snackbar.service';
import { response } from 'express';
import { MatTableDataSource } from '@angular/material/table';
import { globalConstants } from '../shared/globalConstants';
import { MaterialModule } from '../shared/material.module';
import { CommonModule } from '@angular/common';
import { materialize } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [MaterialModule,CommonModule,ReactiveFormsModule],
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.scss'
})
export class ManageUsersComponent implements OnInit{
  displayedColumns : string[] = ['name','email','contact','status',];
  dataSource : any;
  responseMessage : any;


  constructor(
    private userService : UsersService,
    private ngxService : NgxUiLoaderService,
    private snackbar : SnackbarService 
  ){}

  ngOnInit(): void {
      this.ngxService.start();
      this.tableData();
  }

  tableData(){
    this.userService.getUsers().subscribe({
      next : (response : any) => {
        this.ngxService.stop();
        this.dataSource = new MatTableDataSource(response);
      },
      error: (error: any) => {
        this.ngxService.stop();
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        }
        else {
          this.responseMessage = globalConstants.genericError
        }
        this.snackbar.openSnackBar(this.responseMessage,globalConstants.error)
      },
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  handleChangeAction(status:any,id:any){
    var data = {
      status : status.toString(),
      id:id
    }
    this.userService.updateUsers(data).subscribe({
      next : (response : any) =>{
        this.ngxService.stop();
        this.responseMessage = response?.message;
        this.snackbar.openSnackBar(this.responseMessage,"success");
      }, error : (error:any) =>{
        if(error.error?.message){
          this.responseMessage =error.error?.message;
        }
        else{
          this.responseMessage = globalConstants.genericError;
        }
        this.snackbar.openSnackBar(this.responseMessage,globalConstants.error);
      }
    })
  }
}

