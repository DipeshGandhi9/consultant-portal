import { Component, OnInit } from '@angular/core';
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
  ) {
    translate.addLangs(['en']);
    translate.setDefaultLang('en');
    translate.use('en');
    translate.setTranslation('en', translateLang);
  }
}
