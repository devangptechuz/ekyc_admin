import { Injectable } from '@angular/core';

import { Resolve } from '@angular/router';
import { ActivatedRouteSnapshot } from '@angular/router';
import { AdminService } from '../../../shared/services/admin.service';

@Injectable()
export class AddEditAdmin implements Resolve<any> {
  constructor(
    private adminService: AdminService,
  ) { }

  resolve(route: ActivatedRouteSnapshot) {
    return this.adminService.getAdmin(route.paramMap.get('id'));
  }
}
