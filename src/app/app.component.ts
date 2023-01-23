import { Component, OnInit, Inject, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Store } from '@ngxs/store';
import { TranslateService } from '@ngx-translate/core';

import translateLang from './../assets/i18n/en.json';
import { AutenticationAction } from './store/authorization';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'consultent-portal';
  ngOnInit() {}

  constructor(
    public translate: TranslateService,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private store: Store
  ) {
    this.store.dispatch(AutenticationAction.validateLogins);
    translate.addLangs(['en']);
    translate.setDefaultLang('en');
    translate.use('en');
    translate.setTranslation('en', translateLang);
  }

  ngAfterViewInit() {
    this.renderer.setStyle(document.getElementById('preloader'), 'display', 'none');
  }
}
