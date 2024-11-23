import {Routes }from '@angular/router';
import { ManageCategoryComponent } from './manage-category.component';
import { RouteGuardServiceService } from '../services/route-guard-service.service';



export const MaterialRoutes : Routes = [
    {
        path : 'categories',
        component :ManageCategoryComponent,
        canActivate :[RouteGuardServiceService],
        data : {
            expectedRole : ['admin']
        }

    }
]