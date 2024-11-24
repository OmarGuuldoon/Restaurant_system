import { Routes } from '@angular/router';
import { HomeComponentComponent } from './home-component/home-component.component';
import { FullComponent } from './full/full.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BestsellerComponent } from './bestseller/bestseller.component';
import { RouteGuardServiceService } from './services/route-guard-service.service';
import { ManageCategoryComponent } from './manage-category/manage-category.component';
import { ManageProductsComponent } from './manage-products/manage-products.component';
import { ManageOrdersComponent } from './manage-orders/manage-orders.component';
import { ManageBillsComponent } from './manage-bills/manage-bills.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';


export const routes: Routes = [
  { path: '', component: HomeComponentComponent },
  {
    path: 'cafe',
    component: FullComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'categories',
        component: ManageCategoryComponent,
        canActivate: [RouteGuardServiceService],
        data: { expectedRole: ['admin'] },
      },
      {
        path: 'products',
        component: ManageProductsComponent,
        canActivate: [RouteGuardServiceService],
        data: { expectedRole: ['admin'] },
      },
      {
        path: 'orders',
        component: ManageOrdersComponent,
      },
      {
        path: 'bills',
        component: ManageBillsComponent,
      },
      {
        path: 'users',
        component: ManageUsersComponent,
        canActivate: [RouteGuardServiceService],
        data: { expectedRole: ['admin'] },
      },
    ],
  },
  { path: '**', component: HomeComponentComponent }, // Catch-all route
];

