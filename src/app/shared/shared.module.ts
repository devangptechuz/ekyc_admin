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
import { RoleCheckPipe, UserTypePipe } from './pipe/status.pipe';
import { DeleteModelComponent } from './model-popup/delete-model/delete-model.component';
import { LogoutPopupComponent } from './model-popup/logout-popup/logout-popup.component';


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
        DeleteModelComponent
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
        LogoutPopupComponent
    ]
})
export class SharedModule { }
