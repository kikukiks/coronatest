import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
    providedIn: 'root'
})

export class LocaleService {

    public locale = 'et';

    constructor(
        private translateService: TranslateService,
    ) {
        this.changeLocale('et');
        translateService.setDefaultLang('et')
    }

    translate(key = null, params = null) {
        if (key) {
            return this.translateService.instant(key, params);
        } else {
            return '';
        }
    }

    changeLocale(locale) {
        this.locale = locale;
        this.translateService.use(this.locale);
    }
}
