import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../services/category.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SnackbarService } from '../services/snackbar.service';
import { MatTableDataSource } from '@angular/material/table';
import { globalConstants } from '../shared/globalConstants';
import { MaterialModule } from '../shared/material.module';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { CategoryComponent } from '../dailog/category/category.component';
import { ConfirmLogoutDailogComponent } from '../dailog/confirm-logout-dailog/confirm-logout-dailog.component';


@Component({
  selector: 'app-manage-category',
  standalone: true,
  imports: [MaterialModule,CommonModule],
  templateUrl: './manage-category.component.html',
  styleUrl: './manage-category.component.scss'
})
export class ManageCategoryComponent implements OnInit {
  displayedColumns: string[] = ['name','edit'];
  dataSource: any;
  responseMessage: any;

  constructor(
    private categoryService: CategoryService,
    private ngxService: NgxUiLoaderService,
    private router: Router,
    private dialog: MatDialog,
    private snackbarService: SnackbarService

  ) {

  }

  ngOnInit(): void {
    console.log("catogies loaded");
    this.ngxService.start();
    this.tableData();
  }

  tableData(){
    this.categoryService.getCategories().subscribe({
      next : (response : any) =>{
        this.ngxService.stop();
        this.dataSource = new MatTableDataSource(response);
      },
      error : (error : any) => {
        this.ngxService.stop();
        if(error.error?.message){
          this.responseMessage = error.error?.message;

        }
        else {
          this.responseMessage = globalConstants.genericError
        }
        this.snackbarService.openSnackBar(this.responseMessage,globalConstants.error)
      }

    })
  }
  

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  
  handleAddAction(){
    const dailogConfig = new MatDialogConfig();
    dailogConfig.data = {
      action : "Add"
    }
    dailogConfig.width ="850px";
    const dialogRef = this.dialog.open(CategoryComponent,dailogConfig);
    this.router.events.subscribe(()=>{
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onAddCategory.subscribe({
      next : (response :any)=>{
        this.tableData();
      }
    })
  }


  handleEditAction(values : any){
    const dailogConfig = new MatDialogConfig();
    dailogConfig.data = {
      action : "Edit",
      data : values
    }
    dailogConfig.width ="850px";
    const dialogRef = this.dialog.open(CategoryComponent,dailogConfig);
    this.router.events.subscribe(()=>{
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onEditCategory.subscribe({
      next : (response :any)=>{
        this.tableData();
      }
    })
  }
 

  deleteEditAction(values:any){
    const dailogConfig = new MatDialogConfig;
    dailogConfig.data = {
      message : "delete " +values.name+" from category"
    }
    const dialogRef =this.dialog.open(ConfirmLogoutDailogComponent,dailogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe({
      next : (response : any) => {
        this. ngxService.start();
        this.deleteProduct(values.id);
        dialogRef.close();
      }
    })
  }

  deleteProduct(id:any){
    this.categoryService.deleteCategory(id).subscribe({
      next : (response : any) =>{
        this.ngxService.stop();
        this.tableData();
        this.responseMessage = response?.message ;
        this.snackbarService.openSnackBar(this.responseMessage,'success');
      },error : (error:any) =>{
        if(error.error?.message){
          this.responseMessage =error.error?.message;
        }
        else{
          this.responseMessage =globalConstants.genericError;
        }
        this.snackbarService.openSnackBar(this.responseMessage,globalConstants.error);
      }
    })
  }

}
