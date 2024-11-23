import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ProductsService } from '../services/products.service';
import { MatDialog, MatDialogClose, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from '../services/snackbar.service';
import {  Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { globalConstants } from '../shared/globalConstants';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../shared/material.module';
import { Action } from 'rxjs/internal/scheduler/Action';
import { ProductComponent } from '../dailog/product/product.component';
import { response } from 'express';
import { ConfirmLogoutDailogComponent } from '../dailog/confirm-logout-dailog/confirm-logout-dailog.component';
@Component({
  selector: 'app-manage-products',
  standalone: true,
  imports: [CommonModule,MaterialModule],
  templateUrl: './manage-products.component.html',
  styleUrl: './manage-products.component.scss'
})
export class ManageProductsComponent implements OnInit {

  displayedColumns : string[] =['name','categoryName','description','price','edit'];
  dataSource :any;
  responseMessage:any;


  constructor(
    private ngxService:NgxUiLoaderService,
    private productService : ProductsService,
    private dialog:MatDialog,
    private snackbarService :SnackbarService,
    private router : Router
  ){
    
  }

  ngOnInit(): void {
      this.ngxService.start();
      this.tableData();
  }

  tableData(){
    this.productService.getProduct().subscribe({
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
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action : "Add"
    }
    dialogConfig.width = "850px";
    const dailogRef = this.dialog.open(ProductComponent,dialogConfig);
    this.router.events.subscribe({
      next : (response : any) =>{
        dailogRef.close();
      }
    });
    const sub =dailogRef.componentInstance.onAddProduct.subscribe({
      next : () => {
        this.tableData();
      }
    })

  }
  handleEditAction(values:any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action : "Edit",
      data : values,
    }
    dialogConfig.width = "850px";
    const dailogRef = this.dialog.open(ProductComponent,dialogConfig);
    this.router.events.subscribe({
      next : (response : any) =>{
        dailogRef.close();
      }
    });
    const sub =dailogRef.componentInstance.onEditProduct.subscribe({
      next : (response : any) => {
        this.tableData();
      }
    })


  }
  deleteEditAction(values:any){
    const dailogConfig = new MatDialogConfig;
    dailogConfig.data = {
      message : "delete" +values.name+"product"
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
    this.productService.deleteProduct(id).subscribe({
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
  onChange(status:any, id:any){
    var data = {
      status : status.toString(),
      id:id
    }
    this.productService.updateProductStatus(data).subscribe({
      next : (response : any) =>{
        this.ngxService.stop();
        this.responseMessage = response?.message;
        this.snackbarService.openSnackBar(this.responseMessage,"success");
      }, error : (error:any) =>{
        if(error.error?.message){
          this.responseMessage =error.error?.message;
        }
        else{
          this.responseMessage = globalConstants.genericError;
        }
        this.snackbarService.openSnackBar(this.responseMessage,globalConstants.error);
      }
    })
  }
  
}
