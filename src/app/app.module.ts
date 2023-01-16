import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TableModule } from 'primeng/table';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { RadioButtonModule } from 'primeng/radiobutton';
import { EditorModule } from 'primeng/editor';
import { DropdownModule } from 'primeng/dropdown';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClientComponent } from './component/client/client.component';
import { ConsultingComponent } from './component/opd/consulting.component';
import { ClientDetailsComponent } from './component/client/client-details/client-details.component';
import { ConsultingDetailsComponent } from './component/opd/consulting-details/consulting-details.component';
import { StoreModule } from './store';
import { MessageService } from 'primeng/api';
import { DataStoreService } from './global-provider/data-store/data-store.service';
import {ToastModule} from 'primeng/toast';
import { SharedComponentModule } from './shared-component/shared-component.module';

export function HttpLoaderFactory(http: any) {
  return new TranslateHttpLoader(http);
}
@NgModule({
  declarations: [
    AppComponent,
    ClientComponent,
    ConsultingComponent,
    ClientDetailsComponent,
    ConsultingDetailsComponent
  ],
  imports: [
    BrowserModule,
    DialogModule,
    DropdownModule,
    RadioButtonModule,
    EditorModule,
    ButtonModule,
    ToastModule,
    BrowserAnimationsModule,
    SharedComponentModule,
    TableModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    HttpClientModule,
    StoreModule,
    // QuillModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
    }
  })
  ],
  providers: [DataStoreService,MessageService],
  bootstrap: [AppComponent],
})
export class AppModule {}
