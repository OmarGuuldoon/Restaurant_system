import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxUiLoaderModule, NgxUiLoaderService, NgxUiLoaderConfig, SPINNER } from 'ngx-ui-loader';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  text: "Loading...",
  textColor: "#FFFFFF",
  textPosition: "center-center",
  pbColor: "red",
  bgsColor: "red",
  fgsType: SPINNER.ballSpinClockwise,
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NgxUiLoaderModule,
    HttpClientModule,
 // Import the loader module
  ],
  providers: [
    { provide: 'NgxUiLoaderConfig', useValue: ngxUiLoaderConfig }, // Provide custom configuration
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private ngxLoader: NgxUiLoaderService) {}

  startLoader() {
    this.ngxLoader.start(); // Start the loader programmatically
    setTimeout(() => this.ngxLoader.stop(), 3000); // Stop after 3 seconds
  }
}
