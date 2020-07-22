import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-history',
  templateUrl: './user-history.component.html',
  styleUrls: ['./user-history.component.scss']
})
export class UserHistoryComponent implements OnInit {
  userId: any;
  constructor(
    private route: ActivatedRoute,
  ) {
    this.userId = this.route.snapshot.params.id;
  }

  ngOnInit(): void {
  }

}
