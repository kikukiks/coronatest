import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class LayoutService {

    currentLayout;

    constructor() {
        window.addEventListener('resize', (event) => {
            this.resolveLayout();
        });
        this.resolveLayout();
    }

    private resolveLayout() {
        const windowWidth = window.innerWidth;
        if (windowWidth) {
            if (windowWidth > 500) {
                this.currentLayout = 'desktop';
            } else {
                this.currentLayout = 'mobile';
            }
        }
    }
}
