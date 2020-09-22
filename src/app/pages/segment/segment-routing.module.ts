import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NavTabComponent } from './nav-bar/nav-tab.component';
import { SegmentListComponent } from './segment-settings/segment-list/segment-list.component';
import { BrokeragePlanListComponent } from './brokerage-plan/brokerage-plan-list/brokerage-plan-list.component';
import { BrokerageCodeListComponent } from './brokerage-code/brokerage-code-list/brokerage-code-list.component';
import { SubSegmentListComponent } from './segment-settings/sub-segment-list/sub-segment-list.component';
import { SegmentResolver } from './shared/segment.resolver';

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
      },
      {
        path: 'brokerage-codes',
        component: BrokerageCodeListComponent,
        data: {
          title: 'Brokerage Codes List',
        },
      },
      {
        path: 'sub-segments',
        component: SubSegmentListComponent,
        data: {
          title: 'segments',
        },
        resolve: { segments: SegmentResolver }
      },
      {
        path: 'sub-segments/:id',
        component: SubSegmentListComponent,
        data: {
          title: 'segments',
        },
        resolve: { segments: SegmentResolver }
      }
    ]
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
export class SegmentRoutingModule { }
