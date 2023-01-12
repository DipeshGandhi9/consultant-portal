import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { autenticationRoutes } from './authentication-routing.module'

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule, 
    TranslateModule,
    FormsModule,
    RouterModule.forChild(autenticationRoutes),
    ReactiveFormsModule
  ],
})
export class AutenticationModule {}
