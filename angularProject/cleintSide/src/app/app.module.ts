import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MaterialModule } from '../app/shared/material.module';
import { HomeComponentComponent } from '../app/home-component/home-component.component';
import { BestsellerComponent } from '../app/bestseller/bestseller.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { NgxUiLoaderService, NgxUiLoaderConfig, SPINNER } from 'ngx-ui-loader';
import { RouterModule } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { FullComponent } from './full/full.component';
import { SignupModule } from './signup/signup.module';


const ngxUiLoaderConfig: NgxUiLoaderConfig = {
    text: "Loading...",
    textColor: "#FFFFFF",
    textPosition: "center-center",
    pbColor: "red",
    bgsColor: "red",
    fgsType: SPINNER.ballSpinClockwise,
  };

@NgModule({
  declarations: [	
    AppComponent,
    HomeComponentComponent,
    BestsellerComponent,
    SignupComponent,
    FullComponent
   ],
  imports: [
    BrowserModule,
    MaterialModule,
    FlexLayoutModule,
    HttpClientModule,
    NgxUiLoaderModule,
    RouterModule,
    SignupModule
  ],
  providers: [
    { provide: 'NgxUiLoaderConfig', useValue: ngxUiLoaderConfig }, 
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
