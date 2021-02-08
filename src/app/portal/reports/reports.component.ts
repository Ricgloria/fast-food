import {Component, OnInit} from '@angular/core';
import {Sale} from '../../shared/interfaces/sale-box';
import {PaginationInstance} from 'ngx-pagination';
import {take} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  allSales: Sale[] = [];

  salesPag: PaginationInstance = {
    id: 'sales',
    currentPage: 1,
    itemsPerPage: 10,
  };

  constructor(
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.activatedRoute.data.pipe(take(1)).subscribe(res => {
      this.allSales = res.allSales;
    });
  }

}
