import { Component, OnInit } from '@angular/core';
import {SharedService} from '../../../shared/services/shared.service';
declare var $: any;
@Component({
  selector: 'app-nav-tab',
  templateUrl: './nav-tab.component.html',
  styleUrls: ['./nav-tab.component.scss']
})
export class NavTabComponent implements OnInit {

  constructor(private sharedService:SharedService) { }

  ngOnInit(): void {
   this.checkTabName();
  }

  checkTabName() {
    this.sharedService.getTabName().subscribe((result) => {
      if (result && result !== '') {
        $(document).ready(function () {
          $('.nav-link').removeClass('active');
          $('.'+result).addClass('active');
        });
      }
    });
    this.sharedService.setTabName(null);
  }

}
