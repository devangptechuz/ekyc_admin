import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersDetailComponent } from './users-detail/users-detail.component';
import { ListApplicationComponent } from './list-application/list-application.component';
import { AddEditUser } from './shared/add-edit.resolver';
import { EditApplicationComponent } from './edit-application/edit-application.component';
import { UserHistoryComponent } from './user-history/user-history.component';
import { BankDetailComponent } from './bank-detail/bank-detail.component';
import { EditPersoanlAddressDetailsComponent } from './edit-persoanl-address-details/edit-persoanl-address-details.component';
import { ApplicationHistory } from './shared/application-history.resolver';
import { TradingDetailsComponent } from './trading-details/trading-details.component';
import { NomineeDetailsComponent } from './nominee-details/nominee-details.component';
import { SegmentDetailsComponent } from './segment-details/segment-details.component';

const routes: Routes = [
  {
    path: '',
    component: ListApplicationComponent,
    data: {
      title: 'list-application',
    },
  },
  {
    path: 'details/:id',
    component: UsersDetailComponent,
    data: {
      title: 'user-detail',
    },
    resolve: { user: AddEditUser }
  },
  {
    path: 'application-history/:id',
    component: UserHistoryComponent,
    data: {
      title: 'user-history',
    },
    resolve: { user: ApplicationHistory }
  },
  {
    path: 'edit-application',
    component: EditApplicationComponent,
    data: {
      title: 'Edit Application',
    },
  },
  {
    path: 'edit-personal-address/:id',
    component: EditPersoanlAddressDetailsComponent,
    data: {
      title: 'Edit Personal Addresss Details',
    },
  },
  {
    path: 'bank-details/:id',
    component: BankDetailComponent,
    data: {
      title: 'Bank Detail',
    },
  },
  {
    path: 'trading-details/:id',
    component: TradingDetailsComponent,
    data: {
      title: 'Trading Detail',
    },
  },
  {
    path: 'nominee-details/:id',
    component: NomineeDetailsComponent,
    data: {
      title: 'Nominee Detail',
    },
  },
  {
    path: 'segment-details/:id',
    component: SegmentDetailsComponent,
    data: {
      title: 'Segment & Brokerage Detail',
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
