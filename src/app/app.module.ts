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
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true,
    wheelPropagation: false
};

@NgModule({
    declarations: [AppComponent, FullLayoutComponent, ContentLayoutComponent, NotfoundComponent],
    imports: [
        BrowserAnimationsModule,
        AppRoutingModule,
        SharedModule,
        HttpClientModule,
        NgbModule,
        PerfectScrollbarModule,


        // Libraries
        ToastrModule.forRoot({
            maxOpened: 1,
            autoDismiss: true,
            preventDuplicates: true,
            progressBar: true,
            timeOut: 2000,
        }),
        NgxSpinnerModule,

    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpConfigInterceptor,
            multi: true
        },
        AuthGuard,
        PageGuard
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
