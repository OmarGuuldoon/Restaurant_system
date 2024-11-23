import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from '../../services/category.service';
import { SnackbarService } from '../../services/snackbar.service';
import { response } from 'express';
import { globalConstants } from '../../shared/globalConstants';
import { MaterialModule } from '../../shared/material.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [MaterialModule,CommonModule,ReactiveFormsModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent implements OnInit {
  onAddCategory = new EventEmitter();
  onEditCategory = new EventEmitter();
  categoryForm: any = FormGroup;
  dialogAction: any = "Add";
  action: any = "Add";
  ResponseMessage: any;



  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private dialogRef: MatDialogRef<CategoryComponent>,
    private snackbar: SnackbarService,
  ) {

  }

  ngOnInit(): void {
    this.categoryForm = this.formBuilder.group({
      name: [null, [Validators.required]]
    });

    if (this.dialogData.action === 'Edit') {
      this.dialogAction = "Edit";
      this.action = "Update";
      this.categoryForm.patchValue(this.dialogData.data)
    }
  }


  handleSubmit() {
    if (this.dialogAction === "Edit") {
      this.EditCategory();
    }
    else {
      this.addCategory();
    }
  }

  addCategory() {
    var formData = this.categoryForm.value;
    var data = {
      name: formData.name
    }
    console.log(data);
    this.categoryService.addCategory(data).subscribe({
      next: (response: any) => {
        this.dialogRef.close();
        this.onAddCategory.emit();
        this.ResponseMessage = response.message;
        this.snackbar.openSnackBar(this.ResponseMessage, 'success');
      },
      error: (error: any) => {
        this.dialogRef.close();
        if (error.error?.message) {
          this.ResponseMessage = error.error?.message;
        }
        else {
          this.ResponseMessage = globalConstants.genericError
        }
      },
      complete: () => {
        this.snackbar.openSnackBar(this.ResponseMessage, globalConstants.error);
      },

    })

  }
  EditCategory() {
    var formData = this.categoryForm.value;
    var data = {
      id : this.dialogData.data.id,
      name: formData.name
    }
    this.categoryService.updateCategory(data).subscribe({
      next: (response: any) => {
        this.dialogRef.close();
        this.onEditCategory.emit();
        this.ResponseMessage = response.message;
        this.snackbar.openSnackBar(this.ResponseMessage, 'success');
      },
      error: (error: any) => {
        this.dialogRef.close();
        if (error.error?.message) {
          this.ResponseMessage = error.error?.message;
        }
        else {
          this.ResponseMessage = globalConstants.genericError
        }
      },
      complete: () => {
        this.snackbar.openSnackBar(this.ResponseMessage, globalConstants.error);
      },

    })

  }

}
