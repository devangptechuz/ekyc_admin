import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { ActivatedRouteSnapshot } from '@angular/router';
import { UserService } from 'app/shared/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class ApplicationHistory implements Resolve<any> {
  constructor(private userService: UserService) { }

  resolve(route: ActivatedRouteSnapshot) {
    return this.userService.getUserActivity(route.paramMap.get('id'));
  }
}
