import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryComponent } from '../dailog/category/category.component';
import { CategoryService } from '../services/category.service';
import { ProductsService } from '../services/products.service';
import { SnackbarService } from '../services/snackbar.service';
import { BillService } from '../services/bill.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { globalConstants } from '../shared/globalConstants';
import { saveAs } from 'file-saver'
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../shared/material.module';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-manage-orders',
  standalone: true,
  imports: [CommonModule, MaterialModule,ReactiveFormsModule],
  templateUrl: './manage-orders.component.html',
  styleUrl: './manage-orders.component.scss'
})
export class ManageOrdersComponent implements OnInit {
  displayedColumns: string[] = ['name', 'category', 'price', 'total', 'edit'];
  dataSource: any = [];
  orderForm: any = FormGroup;
  categories: any = [];
  products: any = [];
  price: any;
  totalAmount: number = 0;
  responseMessage: any;


  constructor(
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private productService: ProductsService,
    private snackbar: SnackbarService,
    private billservice: BillService,
    private ngxService: NgxUiLoaderService,
    private userService : UsersService
  ) {

  }


  ngOnInit(): void {
    this.getCategory();
    this.orderForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.pattern(globalConstants.nameRegex)]],
      email: [null, [Validators.required, Validators.pattern(globalConstants.emailRegex)]],
      contact: [null, [Validators.required, Validators.pattern(globalConstants.contactNumber)]],
      paymentMethod: [null, [Validators.required]],
      products: [null, [Validators.required]],
      price: [null, [Validators.required]],
      category: [null, [Validators.required]],
      quantity: [null, [Validators.required]],
      total: [0, [Validators.required]],

    })
  }

  getCategory() {
    this.categoryService.getCategories().subscribe({
      next: (response: any) => {
        this.ngxService.stop();
        this.categories = response;
      },
      error: (error: any) => {
        this.ngxService.stop();
        if (error.error?.message) {
          this.responseMessage = error.error?.message
        }
        else {
          this.responseMessage = globalConstants.genericError
        }
        this.snackbar.openSnackBar(this.responseMessage, globalConstants.error)
      }
    })
  }

  getProductByCategory(value: any) {
    this.productService.getProductByCategory(value.id).subscribe({
      next: (response: any) => {
        this.products = response;
        console.log("product info: ",this.products);
        this.orderForm.controls['price'].setValue(1);
        console.log(this.orderForm.controls['price'])
        this.orderForm.controls['quantity'].setValue('');
        this.orderForm.controls['total'].setValue(0);
      },
      error: (error: any) => {
        this.ngxService.stop();
        if (error.error?.message) {
          this.responseMessage = error.error?.message
          console.log("something went wrong")
        }
        else {
          this.responseMessage = globalConstants.genericError
        }
        this.snackbar.openSnackBar(this.responseMessage, globalConstants.error)
      }
    })
  }

  getProductDetails(value: any) {
    this.productService.getById(value.id).subscribe({
      next: (response: any) => {
        if (response.length > 0) {
          const product = response[0]; // Access the first product in the array
          this.price = product.price;
          this.orderForm.controls['price'].setValue(product.price);
          this.orderForm.controls['quantity'].setValue('1');
          this.orderForm.controls['total'].setValue(this.price * 1);
          console.log("Product details: ", product);
          console.log("Updated form: ", this.orderForm.value);
        } else {
          console.log("No products found for the selected ID");
          this.snackbar.openSnackBar("Product not found", globalConstants.error);
        }
      },
      error: (error: any) => {
        this.ngxService.stop();
        this.responseMessage = error.error?.message || globalConstants.genericError;
        this.snackbar.openSnackBar(this.responseMessage, globalConstants.error);
        console.log("Error fetching product details: ", error);
      }
    });    
  }

  setQuantity(value: any) {
    var temp = this.orderForm.controls['quantity'].value;
    if (temp > 0) {
      this.orderForm.controls['total'].setValue(this.orderForm.controls['quantity'].value * this.orderForm.controls['price'].value)
    }
    else if (temp != '') {
      this.orderForm.controls['quantity'].setValue('1');
      this.orderForm.controls['total'].setValue(this.orderForm.controls['quantity'].value * this.orderForm.controls['price'].value)
    }
  }

  validateproductAdd() {
    if (this.orderForm.controls['total'].value === 0 || this.orderForm.controls['total'].value === null || this.orderForm.controls['quantity'].value <= 0) {
      return true
    }
    else {
      return false
    }
  }

  validateSubmitProd() {
    if (this.totalAmount === 0 || this.orderForm.controls['name'].value === null || 
      this.orderForm.controls['email'].value === null ||
       this.orderForm.controls['contact'].value === null || 
       this.orderForm.controls['paymentMethod'].value === null || 
       !(this.orderForm.controls['contact'].valid) ||
       !(this.orderForm.controls['email'])) {
      return true;
    }
    else { 
      return false
    }
  }

  addOrder(){
    var formData = this.orderForm.value;
    console.log("form data : ",formData);
    var productName = this.dataSource.find((e:{id:number})=>e.id == formData.products.id);
    if(productName === undefined){
      this.totalAmount = this.totalAmount + formData.total;
      this.dataSource.push({
        id:formData.products.id,
        name:formData.products.name,
        categories : formData.categories,
        quantity : formData.quantity,
        price : formData.price,
        total : formData.total  
    })
    this.dataSource = [...this.dataSource];
    this.snackbar.openSnackBar(globalConstants.productAdded,"success");   
    }
    this.snackbar.openSnackBar(globalConstants.productExitError,globalConstants.error);   
  }

  handleDeleteAction(value :any, element : any){
    this.totalAmount = this.totalAmount - element.total;
    this.dataSource.splice(value,1);
    this.dataSource = [...this.dataSource];
  }

  submitAction(){
    this.ngxService.start();
    var formData =  this.orderForm.value;
    var data = {
      name : formData.name,
      email : formData.email,
      contact : formData.contact,
      paymentMethod : formData.paymentMethod,
      totalAmount : this.totalAmount,
      createdBy: "omar",
      productDetails : JSON.stringify(this.dataSource) 
    }
    this.billservice.generateReport(data).subscribe({
      next : (response : any ) => {
         this.downlaodFile(response?.uuid);
         this.orderForm.reset();
         this.dataSource = [];
         this.totalAmount = 0;
      },
      error : (error :any ) =>{
         this.ngxService.stop();
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
  downlaodFile(fileName : any){
    var data = {
      uuid : fileName
    }
    this.billservice.getPdf(data).subscribe({
      next : (response : any) => {
        saveAs(response,fileName+'.pdf');
        this.ngxService.stop();
      }
    })
  }

}
