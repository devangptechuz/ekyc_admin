import { Component, HostBinding ,HostListener} from '@angular/core';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})

export class FooterComponent{
    //Variables
    showScroll: boolean;
    showScrollHeight = 700;
    hideScrollHeight = 30;
    currentDate : Date = new Date();
    constructor() { }

    @HostListener('window:scroll', [])
    onWindowScroll()
    {
        if (( window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop) > this.showScrollHeight)
        {
            this.showScroll = true;
        }
        else if ( this.showScroll && (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop) < this.hideScrollHeight)
        {
            this.showScroll = false;
        }
    }

    scrollToTop()
    {
        (function smoothscroll()
        { var currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
            if (currentScroll > 0)
            {
                window.requestAnimationFrame(smoothscroll);
                window.scrollTo(0, currentScroll - (currentScroll / 5));
            }
        })();
    }

}
