import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ProductsService } from '../../services/products.service';
import { SnackbarService } from '../../services/snackbar.service';
import { Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { globalConstants } from '../../shared/globalConstants';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/material.module';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, MaterialModule,ReactiveFormsModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent  implements OnInit{
  onAddProduct = new EventEmitter();
  onEditProduct = new EventEmitter();
  productForm : any = FormGroup;
  dialogAction : any = 'Add';
  action : any = "Add";
  responseMessage :any;
  categories : any = []

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private formBuilder : FormBuilder,
    private productService : ProductsService,
    public dialogRef : MatDialogRef<ProductComponent>,
    private snackbar : SnackbarService,
    private router : Router,
    private categoryService : CategoryService
  ){

  }
   
  ngOnInit(): void {
      this.productForm = this.formBuilder.group({
        name : [null,[Validators.required,Validators.pattern(globalConstants.nameRegex)]],
        categoryId : [null,[Validators.required]],
        price : [null, [Validators.required]],
        description : [null, [Validators.required]],
      });

      this.dialogAction = this.dialogData.action; // Use the dialogData action directly
    this.action = this.dialogAction === "Edit" ? "Update" : "Add";

    // Patch form values if editing
    if (this.dialogAction === "Edit") {
        this.productForm.patchValue(this.dialogData.data);
    }

    this.getCategories();
  }


  getCategories(){
    this.categoryService.getCategories().subscribe({
      next : (response : any) =>{
        this.categories = response;
      },
      error : (error:any) => {
        if(error.error?.message){
          this.responseMessage = error.error?.message;
        }
        else {
          this.responseMessage = globalConstants.genericError
        }
        this.snackbar.openSnackBar(this.responseMessage,globalConstants.error);
      }
    })
  }

  handleSubmit(){
    if(this.dialogAction === 'Edit'){
       return this.edit();
    }
    else {
      return this.add();
    }
  }

  add(){
    var formData = this.productForm.value;
    var data = {
      name : formData.name,
      categoryId : formData.categoryId,
      price : formData.price,
      description : formData.description,
    }
    this.productService.addProduct(data).subscribe({
      next : (response : any) => {
        this.dialogRef.close();
        this.onAddProduct.emit();
        this.responseMessage = response.message;
        this.snackbar.openSnackBar(this.responseMessage,'success')
      },
      error : (error) => {
         if(error.error?.message){
          this.responseMessage = error.error?.message;
         }
         else {
          this.responseMessage = globalConstants.genericError;
         }
         this.snackbar.openSnackBar(this.responseMessage,globalConstants.error)
      } 
    })
  }
  edit(){
    var formData = this.productForm.value;
    var data = {
      id : this.dialogData.data.id,
      name : formData.name,
      categoryId : formData.categoryId,
      price : formData.price,
      description : formData.description,
    }
    this.productService.updateProduct(data).subscribe({
      next : (response : any) => {
        this.dialogRef.close();
        this.onEditProduct.emit();
        this.responseMessage = response.message;
        this.snackbar.openSnackBar(this.responseMessage,'success')
      },
      error : (error) => {
         if(error.error?.message){
          this.responseMessage = error.error?.message;
         }
         else {
          this.responseMessage = globalConstants.genericError;
         }
         this.snackbar.openSnackBar(this.responseMessage,globalConstants.error)
      } 
    })
  }
}
