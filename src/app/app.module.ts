import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from "./shared/shared.module";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from "@angular/common/http";

import { PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { AppComponent } from './app.component';
import { ContentLayoutComponent } from "./layouts/content/content-layout.component";
import { FullLayoutComponent } from "./layouts/full/full-layout.component";

import { AuthGuard } from './shared/guards/auth-guard.service';
import { PageGuard } from './shared/guards/page-guard.service';

// Interceptor
import { HttpConfigInterceptor } from './shared/interceptor/httpconfig.interceptor';

// Libraries
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from "ngx-spinner";

// Modules
import { NotfoundComponent } from './notfound/notfound.component';
import { AddEditAdmin } from './pages/admin/shared/add-edit.resolver';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserCookiesModule } from '@ngx-utils/cookies/browser';
import { CategoryResolver } from './pages/settings/shared/category.resolver';
// import { SegmentResolver } from './pages/settings/shared/segment.resolver';
import { AddEditEmailTemplate } from './pages/common-configure/email-template/shared/add-edit.resolver';
import { ReasonResolver } from './pages/settings/shared/reason.resolver';
import { EditEmailModelComponent } from './shared/model-popup/edit-email-model/edit-email-model.component';
import { SegmentResolver } from './pages/segment/shared/segment.resolver';
import { DashboardResolver } from './pages/dashboard/shared/dashboard.resolver';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true,
    wheelPropagation: false
};

@NgModule({
    declarations: [AppComponent, FullLayoutComponent, ContentLayoutComponent, NotfoundComponent],
    imports: [
        BrowserAnimationsModule,
        BrowserModule.withServerTransition({ appId: 'your-app-id' }),
        BrowserCookiesModule.forRoot(),
        AppRoutingModule,
        SharedModule,
        HttpClientModule,
        NgbModule,
        PerfectScrollbarModule,
        // Libraries
        ToastrModule.forRoot({ timeOut: 4000, positionClass: 'toast-top-right', preventDuplicates: true }),
        NgxSpinnerModule,
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpConfigInterceptor,
            multi: true
        },
        AddEditAdmin,
        AddEditEmailTemplate,
        EditEmailModelComponent,
        CategoryResolver,
        ReasonResolver,
        SegmentResolver,
        DashboardResolver,
        AuthGuard,
        PageGuard
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
