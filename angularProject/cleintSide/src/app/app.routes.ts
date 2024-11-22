import { Routes } from '@angular/router';
import { HomeComponentComponent } from './home-component/home-component.component';
import { FullComponent } from './full/full.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BestsellerComponent } from './bestseller/bestseller.component';
import { RouteGuardServiceService } from './services/route-guard-service.service';


export const routes: Routes = [
  { path: '', component: HomeComponentComponent },
  {
    path: 'cafe',
    component: FullComponent,
        canActivate :[RouteGuardServiceService],
        data : {
            expectedRole : ['admin','user'],
        } ,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent, // Dashboard child route
      },
      {
        path: 'bestsellers',
        component: BestsellerComponent, // Another example child route
      },
 
    ],
  },
  { path: '**', component: HomeComponentComponent }, // Catch-all route
];
