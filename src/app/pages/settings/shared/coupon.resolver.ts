import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { ActivatedRouteSnapshot } from '@angular/router';
import { SettingService } from '../../../shared/services/setting.service';

@Injectable()
export class CouponResolver implements Resolve<any> {
  constructor(
    private settingService: SettingService
  ) { }

  resolve(route: ActivatedRouteSnapshot) {
    return this.settingService.getAllPromotionalCodeList();
  }
}
