import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class PageService {

    public modals = {
        'authors': {
            opened: false,
            data: null
        },
        'close_contact': {
            opened: false,
            data: null
        },
        'location': {
            opened: false,
            data: null
        },
    }

    constructor(private router: Router) {
    }

    private _submissionResult: any;
    get submissionResult() {
        if (!this._submissionResult) {
            this.router.navigate(['/']);
            return;
        }
        return this._submissionResult;
    }

    set submissionResult(value) {
        this._submissionResult = value;
    }

    openModal(identifier, data?, type = null) {
        this.modals[identifier].opened = true;
        this.modals[identifier].data = data;

        document.body.style.overflow = 'hidden';
    }

    closeModal(identifier, event = null) {
        this.modals[identifier].opened = false;
        this.modals[identifier].data = null;
        document.body.style.overflow = 'auto';
        if (event) event.stopPropagation();
    }
}
