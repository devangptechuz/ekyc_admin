import { Routes } from '@angular/router';
import { PageGuard } from '../guards/page-guard.service';

//Route for content layout with sidebar, navbar and footer
export const Full_ROUTES: Routes = [
    {
        path: 'dashboard',
        loadChildren: () => import('../../pages/dashboard/dashboard.module').then(m => m.DashboardModule),
        canActivateChild: [PageGuard]
    },
    {
        path: 'admins',
        loadChildren: () => import('../../pages/admin/admin.module').then(m => m.AdminModule),
        canActivateChild: [PageGuard]
    },
    {
        path: 'settings',
        loadChildren: () => import('../../pages/admin/admin.module').then(m => m.AdminModule),
        canActivateChild: [PageGuard]
    },
    {
        path: 'applications',
        loadChildren: () => import('../../pages/users/users.module').then(m => m.UsersModule),
        canActivateChild: [PageGuard]
    }
];
