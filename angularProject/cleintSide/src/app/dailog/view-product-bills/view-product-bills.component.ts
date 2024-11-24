import { Component , Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../shared/material.module';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-view-product-bills',
  standalone: true,
  imports: [MaterialModule,CommonModule, ReactiveFormsModule],
  templateUrl: './view-product-bills.component.html',
  styleUrl: './view-product-bills.component.scss'
})
export class ViewProductBillsComponent implements OnInit{

  displayedColumns : string[] = ['name','category','price','quantity','total'];
  dataSource :any;
  data : any;


  constructor(
    @Inject (MAT_DIALOG_DATA) public dialogData :any,
    public dialogRef :MatDialogRef<ViewProductBillsComponent>
  ){}
  ngOnInit(): void {
      this.data =this.dialogData.data;
      this.dataSource = JSON.parse(this.dialogData.data.productDetails) 
  }
}
