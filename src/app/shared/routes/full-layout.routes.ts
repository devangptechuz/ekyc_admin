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
        path: 'sub-admin',
        loadChildren: () => import('../../pages/sub-admin/sub-admin.module').then(m => m.SubAdminModule),
        canActivateChild: [PageGuard]
    },
];
