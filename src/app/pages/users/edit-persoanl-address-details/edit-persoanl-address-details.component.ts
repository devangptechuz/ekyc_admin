import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-persoanl-address-details',
  templateUrl: './edit-persoanl-address-details.component.html',
  styleUrls: ['./edit-persoanl-address-details.component.scss']
})
export class EditPersoanlAddressDetailsComponent implements OnInit {
  userId: any;
  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.userId = this.route.snapshot.params.id;
  }

}
