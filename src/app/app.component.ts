import { Component, OnInit, Inject, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

import translateLang from './../assets/i18n/en.json';

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
  ) {
    translate.addLangs(['en']);
    translate.setDefaultLang('en');
    translate.use('en');
    translate.setTranslation('en', translateLang);
  }

  ngAfterViewInit() {
    this.renderer.setStyle(document.getElementById('preloader'), 'display', 'none');
  }
}
