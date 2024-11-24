import { Component, OnInit } from '@angular/core';
import { BillService } from '../services/bill.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';
import { SnackbarService } from '../services/snackbar.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { globalConstants } from '../shared/globalConstants';
import { ViewProductBillsComponent } from '../dailog/view-product-bills/view-product-bills.component';
import { MaterialModule } from '../shared/material.module';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfirmLogoutDailogComponent } from '../dailog/confirm-logout-dailog/confirm-logout-dailog.component';
import { saveAs } from 'file-saver'

@Component({
  selector: 'app-manage-bills',
  standalone: true,
  imports: [MaterialModule , CommonModule, ReactiveFormsModule],
  templateUrl: './manage-bills.component.html',
  styleUrl: './manage-bills.component.scss'
})
export class ManageBillsComponent implements OnInit{
  displayedColumns : string[] =['name','email','contact','paymentMethod','total','view'];
  dataSource : any;
  responseMessage : any;
  
  
  constructor(
    private billService : BillService,
    private ngxService : NgxUiLoaderService,
    private router : Router,
    private snackbar : SnackbarService,
    private dialog :MatDialog 

  ){

  }

  ngOnInit(): void {
   this.ngxService.start();
   this.tableData();   
  }

  tableData(){
    this.billService.getBills().subscribe({
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


  handleViewAction(values:any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      data : values
    }
    dialogConfig.width = "100%";
    const dialogRef = this.dialog.open(ViewProductBillsComponent,dialogConfig)
    this.router.events.subscribe(()=>{
      dialogRef.close();
    })
  }

  downloadReportAction(values:any){
    this.ngxService.start();
    var data = {
      name : values.name,
      email : values.email,
      uuid : values.uuid,
      contact : values.contact,
      paymentMethod : values.paymentMethod,
      totalAmount : values.totalAmount,
      productDetails : values.productDetails
    }
    this.billService.getPdf(data).subscribe({
      next : (response : any) => {
        saveAs(response , values.uuid + '.pdf');
        this.ngxService.stop();

      }
    })

  }
  deleteBillAction(values:any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message : `deleted ${values.name} bill succesfully`
    }
    const dialogRef = this.dialog.open(ConfirmLogoutDailogComponent,dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe({
      next : () => {
        this.ngxService.start();
        this.deleteProduct(values.id);
        dialogRef.close();
      }
    })

  }

  deleteProduct(id:any){
    this.billService.deleteBill(id).subscribe({
      next : (response : any) => {
        this.ngxService.stop();
        this.responseMessage = response?.message;
        this.snackbar.openSnackBar(this.responseMessage,'success');
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
}
