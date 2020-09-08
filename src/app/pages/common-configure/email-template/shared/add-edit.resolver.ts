import { Injectable } from '@angular/core';

import { Resolve } from '@angular/router';
import { ActivatedRouteSnapshot } from '@angular/router';
import { GlobalConfigureService } from 'app/shared/services/global-configure.service';

@Injectable()
export class AddEditEmailTemplate implements Resolve<any> {
  constructor(
    private globalConfigureService: GlobalConfigureService,
  ) { }

  resolve(route: ActivatedRouteSnapshot) {
    return this.globalConfigureService.getEmailTemplate(route.paramMap.get('id'));
  }
}
