import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-bank-detail',
  templateUrl: './bank-detail.component.html',
  styleUrls: ['./bank-detail.component.scss']
})
export class BankDetailComponent implements OnInit {
  userId: any;
  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.userId = this.route.snapshot.params.id;
  }

}
