import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../authorization/auth-guard/auth.guard";

import { DashboardComponent } from "../component/dashboard/dashboard.component";
import { ConsultingDetailsComponent } from "../component/consulting/consulting-details/consulting-details.component";
import { ConsultingComponent } from "../component/consulting/consulting.component";
import { ClientDetailsComponent } from "../component/client/client-details/client-details.component";
import { ClientComponent } from "../component/client/client.component";
import { FullLayoutComponent } from "./full-layout/full-layout.component";

const routes: Routes = [
  { path: "", redirectTo: "dashboard", pathMatch: "full" },
  {
    path: "",
    component: FullLayoutComponent, // LayoutComponent
    canActivate:[AuthGuard],
    children: [
      { path: "dashboard", component: DashboardComponent, },
      { path: "clients", component: ClientComponent },
      { path: "consulting", component: ConsultingComponent },
      { path: "clients/:id", component: ClientDetailsComponent },
      { path: "clients-consulting", component: ConsultingDetailsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
