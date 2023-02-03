import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from "primeng/dialog";
import { ButtonModule } from 'primeng/button';
import { DynamicDialogModule } from "primeng/dynamicdialog";
import { TranslateModule } from '@ngx-translate/core';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DialogService } from 'primeng/dynamicdialog';
import { DropdownModule } from 'primeng/dropdown';

import { DialogComponent } from './dialog.component';
import { SharedComponentModule } from '../shared-component.module';


@NgModule({
    declarations: [
        DialogComponent
    ],
    imports: [
        CommonModule,
        DropdownModule,
        ReactiveFormsModule,
        RadioButtonModule,
        SharedComponentModule,
        DialogModule,
        ButtonModule,
        DynamicDialogModule,
        TranslateModule,
        TooltipModule,
        CheckboxModule,
        FormsModule
    ],
    providers: [DialogService]
})
export class dialogModule {
}
