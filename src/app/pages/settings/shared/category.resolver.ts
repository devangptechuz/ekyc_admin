import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { ActivatedRouteSnapshot } from '@angular/router';
import { SettingService } from '../../../shared/services/setting.service';

@Injectable()
export class CategoryResolver implements Resolve<any> {
  constructor(
    private settingService: SettingService
  ) {

  }

  resolve(route: ActivatedRouteSnapshot) {
    return this.settingService.getSubReasonCategory(route.paramMap.get('id'));
  }
}
