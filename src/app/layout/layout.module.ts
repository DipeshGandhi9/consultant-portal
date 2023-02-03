import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { dialogModule } from '../shared-component/dialog/dialog.module';

import { LayoutRoutingModule } from './layout-routing.module';
import { FullLayoutComponent } from './full-layout/full-layout.component';
import { SharedComponentModule } from '../shared-component/shared-component.module';
import { DashboardComponent } from '../component/dashboard/dashboard.component';
import { LayoutComponent } from './layout/layout.component';
import { DialogService } from 'primeng/dynamicdialog';
@NgModule({
  declarations: [
    FullLayoutComponent,
    DashboardComponent,
    LayoutComponent,
  ],
  imports: [CommonModule, dialogModule, SharedComponentModule, LayoutRoutingModule, TranslateModule],
  providers:[DialogService]
})
export class LayoutModule {}
