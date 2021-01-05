import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateFormComponent } from './create-form/create-form.component';
import { AdminProfileComponent } from './account-settings/admin-profile/admin-profile.component';
import { CategoryResolver } from './shared/category.resolver';
import { SubCategoryComponent } from './application-settings/sub-category/sub-category.component';
import { SubSegmentListComponent } from './segment-settings/sub-segment-list/sub-segment-list.component';
import { SegmentResolver } from './shared/segment.resolver';
import { NavTabComponent } from './nav-bar/nav-tab.component';
import { BrokeragePlanListComponent } from './brokerage-plan/brokerage-plan-list/brokerage-plan-list.component';
import { ApplicationPreferenceComponent } from './application-preference/application-preference/application-preference.component';
import { ApplicationSettingComponent } from './application-settings/application-setting/application-setting.component';
import { SegmentListComponent } from './segment-settings/segment-list/segment-list.component';
import { BrokerageCodeListComponent } from './brokerage-code/brokerage-code-list/brokerage-code-list.component';
import { NavBarReasonCategoryComponent } from './application-settings/nav-bar-reason-category/nav-bar-reason-category.component';
import { ReasonListComponent } from './application-settings/reason-list/reason-list.component';
import { ReasonResolver } from './shared/reason.resolver';
import { ListPromocodeComponent } from './promotional/list-promocode/list-promocode.component';
import { CouponResolver } from './shared/coupon.resolver';

const routes: Routes = [
  {
    path: '',
    component: NavTabComponent,  // todo application settings routing here
    data: {
      title: 'tab',
    },
    children: [
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
      // {
      //   path: 'segments-settings',
      //   component: SegmentListComponent,
      //   data: {
      //     title: 'segments-settings',
      //   },
      // },
      // {
      //   path: 'brokerage-plans',
      //   component: BrokeragePlanListComponent,
      //   data: {
      //     title: 'Segment Plan List',
      //   },
      // },
      // {
      //   path: 'brokerage-codes',
      //   component: BrokerageCodeListComponent,
      //   data: {
      //     title: 'Brokerage Codes List',
      //   },
      // }
    ]
  },
  {
    path: 'reasons',
    component: NavBarReasonCategoryComponent,  // todo Reasons Category routing here
    data: {
      title: 'tab',
    },
    children: [
      {
        path: 'application-settings',
        component: ApplicationSettingComponent,
        data: {
          title: 'application-settings',
        },
      },
      {
        path: 'sub-category',
        component: SubCategoryComponent,
        data: {
          title: 'Sub category',
        },
        resolve: { category: CategoryResolver }
      },
      {
        path: 'sub-category/:id',
        component: SubCategoryComponent,
        data: {
          title: 'Sub category',
        },
        resolve: { category: CategoryResolver }
      },
      {
        path: 'reason',
        component: ReasonListComponent,
        data: {
          title: 'Reason',
        },
        resolve: { reasons: ReasonResolver }
      },
    ],
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
  },
  {
    path: 'promotional-code',
    component: ListPromocodeComponent,
    data: {
      title: 'List Promotional Code',
    },
    resolve: { couponList: CouponResolver }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
