import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MegaMenuModule } from 'primeng/megamenu';
import { SidebarModule } from 'primeng/sidebar';
import { FormsModule ,ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { EditorModule } from 'primeng/editor';
import { DialogService } from 'primeng/dynamicdialog';
 
import { SharedComponentRoutingModule } from './shared-component-routing.module';
import { TableComponent } from './table/table.component';
import { BlankComponent } from './blank/blank.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AgePipe } from '../global-provider/pipes/age.pipe';
import { QuillEditorComponent } from './quill-editor/quill-editor.component';
import { RadioButtonModule } from 'primeng/radiobutton';

@NgModule({
  declarations: [
    TableComponent,
    BlankComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    AgePipe,
    QuillEditorComponent,
  ],
  imports: [
    CommonModule,
    EditorModule,
    RadioButtonModule,
    DialogModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    SharedComponentRoutingModule,
    MegaMenuModule,
    SidebarModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    TableComponent,
    BlankComponent,
    QuillEditorComponent,
    FooterComponent,
    AgePipe,
    HeaderComponent,
    SidebarComponent,
  ],
  providers:[DialogService]
})
export class SharedComponentModule {}
