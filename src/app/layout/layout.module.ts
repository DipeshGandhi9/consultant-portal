import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { LayoutRoutingModule } from './layout-routing.module';
import { FullLayoutComponent } from './full-layout/full-layout.component';
import { SharedComponentModule } from '../shared-component/shared-component.module';
import { DashboardComponent } from '../component/dashboard/dashboard.component';
import { LayoutComponent } from './layout/layout.component';

@NgModule({
  declarations: [
    FullLayoutComponent,
    DashboardComponent,
    LayoutComponent,
  ],
  imports: [CommonModule, SharedComponentModule, LayoutRoutingModule, TranslateModule],
})
export class LayoutModule {}
