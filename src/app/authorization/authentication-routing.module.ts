import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NotAuthGuard } from "./auth-guard/not-auth.guard";
import { LoginComponent } from "./login/login.component";


export const autenticationRoutes: Routes = [
  { path: "", redirectTo: "login", pathMatch: "full" },
  {
    path: "login",
    canActivate:[NotAuthGuard],
    component: LoginComponent, // LayoutComponent
  },
  {
    path : "**",
    redirectTo:"login"
  }
];
