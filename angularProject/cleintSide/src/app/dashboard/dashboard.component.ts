import { AfterViewInit, Component} from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { SnackbarService } from '../services/snackbar.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { globalConstants } from '../shared/globalConstants';
import { MaterialModule } from '../shared/material.module';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MaterialModule,RouterLink,CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements AfterViewInit {
  responseMessage : any;
  data: { categoryCount: number; productCount: number; billCount: number } = {
    categoryCount: 0,
    productCount: 0,
    billCount: 0,
  };

  constructor(
    private dashboardService : DashboardService,
    private snackbarService : SnackbarService,
    private ngxService : NgxUiLoaderService
  ) {
    this.ngxService.start();
    this.dashboardData();
  }
  ngAfterViewInit(): void {
      console.log("dashboard is loaded in the main area");
  }


  dashboardData (){
    this.dashboardService.getDetails().subscribe(
    (response : any) => {
      this.ngxService.stop();
      this.data = response;
      console.log(this.data.billCount);
    },(error : any) => {
      this.ngxService.stop();
      console.log(error);
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }
      else {
        this.responseMessage = globalConstants.genericError
      }
      this.snackbarService.openSnackBar(this.responseMessage,globalConstants.error);
    }
    )
  }
}
