import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../authorization/auth-guard/auth.guard";

import { DashboardComponent } from "../component/dashboard/dashboard.component";
import { ConsultingDetailsComponent } from "../component/opd/consulting-details/consulting-details.component";
import { ConsultingComponent } from "../component/opd/consulting.component";
import { PatientDetailsComponent } from "../component/patients/patient-details/patient-details.component";
import { PatientsComponent } from "../component/patients/patients.component";
import { FullLayoutComponent } from "./full-layout/full-layout.component";

const routes: Routes = [
  { path: "", redirectTo: "dashboard", pathMatch: "full" },
  {
    path: "",
    component: FullLayoutComponent, // LayoutComponent
    canActivate:[AuthGuard],
    children: [
      { path: "dashboard", component: DashboardComponent, },
      { path: "clients", component: PatientsComponent },
      { path: "consulting", component: ConsultingComponent },
      { path: "clients/:id", component: PatientDetailsComponent },
      { path: "clients/consulting/:id", component: ConsultingDetailsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
