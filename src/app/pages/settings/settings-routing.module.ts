import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateFormComponent } from './create-form/create-form.component';
import { AdminProfileComponent } from './admin-profile/admin-profile.component';
import { CategoryResolver } from './shared/category.resolver';
import { SubCategoryComponent } from './sub-category/sub-category.component';
import { SubSegmentListComponent } from './sub-segment-list/sub-segment-list.component';
import { SegmentResolver } from './shared/segment.resolver';
import {NavTabComponent} from './nav-tab/nav-tab.component';
import {SegmentPlanListComponent} from './segment-plan-list/segment-plan-list.component';
import {ApplicationPrefrenceComponent} from './application-prefrence/application-prefrence.component';
import {ApplicationSettingComponent} from './application-setting/application-setting.component';
import {SegmentListComponent} from './segment-list/segment-list.component';

const routes: Routes = [
  {
    path: '',
    component: NavTabComponent,
    data: {
      title: 'tab',
    },
    children:[
        {
          path: '',
          component: ApplicationPrefrenceComponent,
          data: {
            title: 'application-prefrence',
          },
        },
        {
          path: 'account-settings',
          component: AdminProfileComponent,
          data: {
            title: 'account-settings',
          },
        },
        {
          path: 'application-settings',
          component: ApplicationSettingComponent,
          data: {
            title: 'application-settings',
          },
        },
        {
          path: 'segments-settings',
          component: SegmentListComponent,
          data: {
            title: 'segments-settings',
          },
        },
        {
          path: 'segments-plan',
          component: SegmentPlanListComponent,
          data: {
          title: 'Segment Plan List',
          },
        }
    ]
  },
  {
    path: 'dynamic-form',
    component: CreateFormComponent,
    data: {
      title: 'Create Dynamic Form',
    },
  },
  {
    path: 'sub-category/:id',
    component: SubCategoryComponent,
    data: {
      title: 'Category',
    },
    resolve: { category: CategoryResolver }
  },
  {
    path: 'sub-segments/:id',
    component: SubSegmentListComponent,
    data: {
      title: 'segments',
    },
    resolve: { segments: SegmentResolver }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
