import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateFormComponent } from './create-form/create-form.component';
import { AdminProfileComponent } from './account-settings/admin-profile/admin-profile.component';
import { CategoryResolver } from './shared/category.resolver';
import { SubCategoryComponent } from './application-settings/sub-category/sub-category.component';
import { SubSegmentListComponent } from './segment-settings/sub-segment-list/sub-segment-list.component';
import { SegmentResolver } from './shared/segment.resolver';
import {NavTabComponent} from './nav-bar/nav-tab.component';
import {BrokeragePlanListComponent} from './brokerage-plan/Brokerage-plan-list/brokerage-plan-list.component';
import {ApplicationPreferenceComponent} from './application-preference/application-preference/application-preference.component';
import {ApplicationSettingComponent} from './application-settings/application-setting/application-setting.component';
import {SegmentListComponent} from './segment-settings/segment-list/segment-list.component';

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
          component: ApplicationPreferenceComponent,
          data: {
            title: 'application-preference',
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
          path: 'brokerage-plans',
          component: BrokeragePlanListComponent,
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
