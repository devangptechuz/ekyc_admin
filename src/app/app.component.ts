import { Component, AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
    private _router: Subscription;
    routeOptions: any;
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private titleService: Title
    ) { }
    ngOnInit(): void {
        this._router = this.router.events.subscribe(e => {
            if (e instanceof NavigationEnd) {
                this.runOnRouteChange();
            }
        });
    }

    ngAfterViewInit(): void {
        setTimeout(_ => this.runOnRouteChange());
    }

    ngOnDestroy() {
        this._router.unsubscribe();
    }

    runOnRouteChange(): void {
        this.route.children.forEach((route: ActivatedRoute) => {
            let activeRoute: ActivatedRoute = route;
            while (activeRoute.firstChild) {
                activeRoute = activeRoute.firstChild;
            }
            this.routeOptions = activeRoute.snapshot.data;
        });

        if (this.routeOptions) {
            if (this.routeOptions.hasOwnProperty('title')) {
                this.setTitle(this.routeOptions.title);
            }
        }
    }

    setTitle(newTitle: string) {
        this.titleService.setTitle(newTitle + ' | EKYC');
    }
}
