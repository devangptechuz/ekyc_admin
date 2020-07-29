import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";

//COMPONENTS
import { FooterComponent } from "../shared/components/footer/footer.component";
import { NavbarComponent } from "../shared/components/navbar/navbar.component";
import { SidebarComponent } from "../shared/components/sidebar/sidebar.component";
import { CustomizerComponent } from './customizer/customizer.component';
import { ControlMessagesComponent } from './components/control-messages/control-messages.component';

//DIRECTIVES
import { ToggleFullscreenDirective } from "./directives/toggle-fullscreen.directive";
import { SidebarDirective } from './directives/sidebar.directive';
import { SidebarLinkDirective } from './directives/sidebarlink.directive';
import { SidebarListDirective } from './directives/sidebarlist.directive';
import { SidebarAnchorToggleDirective } from './directives/sidebaranchortoggle.directive';
import { SidebarToggleDirective } from './directives/sidebartoggle.directive';
import { RoleCheckPipe, SafeUrlPipe, UserTypePipe } from './pipe/status.pipe';
import { LogoutPopupComponent } from './model-popup/logout-popup/logout-popup.component';

import { DeleteModelComponent } from './model-popup/delete-model/delete-model.component';
import { ApprovedModelComponent } from './model-popup/approved-model/approved-model.component';
import { RejectModelComponent } from './model-popup/reject-model/reject-model.component';
import { DeactivateModelComponent } from './model-popup/deactivate-model/deactivate-model.component';
import { ActivateModelComponent } from './model-popup/activate-model/activate-model.component';
import { ScrollTopComponent } from './components/scroll-top/scroll-top.component';


@NgModule({
        exports: [
                CommonModule,
                FooterComponent,
                NavbarComponent,
                SidebarComponent,
                ControlMessagesComponent,
                CustomizerComponent,
                ToggleFullscreenDirective,
                SidebarDirective,
                NgbModule,
                RoleCheckPipe,
                UserTypePipe,
                SafeUrlPipe,
                DeleteModelComponent,
                ApprovedModelComponent,
                RejectModelComponent,
                ScrollTopComponent
        ],
        imports: [
                RouterModule,
                CommonModule,
                NgbModule,
                PerfectScrollbarModule
        ],
        declarations: [
                FooterComponent,
                DeleteModelComponent,
                NavbarComponent,
                SidebarComponent,
                ControlMessagesComponent,
                CustomizerComponent,
                ToggleFullscreenDirective,
                SidebarDirective,
                SidebarLinkDirective,
                SidebarListDirective,
                SidebarAnchorToggleDirective,
                SidebarToggleDirective,
                RoleCheckPipe,
                UserTypePipe,
                SafeUrlPipe,
                LogoutPopupComponent,
                ApprovedModelComponent,
                RejectModelComponent,
                DeactivateModelComponent,
                ActivateModelComponent,
                ScrollTopComponent
        ]
})
export class SharedModule { }
