import { Component } from '@angular/core';
import { ChangeDetectorRef, OnDestroy, AfterViewInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { MaterialModule } from '../shared/material.module';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-full',
  templateUrl: './full.component.html',
  standalone:true,
  imports : [MaterialModule,RouterOutlet,SidebarComponent,HeaderComponent],
  styleUrls: ['./full.component.scss'],
})
export class FullComponent implements OnDestroy, AfterViewInit {
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();

    // Updated to addEventListener
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  ngOnInit ():void {
    console.log("full screen is loaded");
  }
  ngOnDestroy(): void {
    // Updated to removeEventListener
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }

  ngAfterViewInit() {}
}
