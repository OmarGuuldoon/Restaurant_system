import { ChangeDetectorRef, Component, OnDestroy, AfterViewInit, OnInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { MaterialModule } from '../../shared/material.module';
import { jwtDecode } from 'jwt-decode';
import { MenuItems } from '../../shared/menuItem';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MaterialModule,CommonModule,RouterLink,RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnDestroy {

  ngOnInit(): void {
      console.log('sidebar is loaded');
  }
  mobileQuery: MediaQueryList;
  token : any = localStorage.getItem('token');
  tokenPayload : any;

  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public menuItems : MenuItems
  ) {
    this.tokenPayload = jwtDecode(this.token);
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();

    // Updated to addEventListener
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    // Updated to removeEventListener
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }

  ngAfterViewInit() {}
}
