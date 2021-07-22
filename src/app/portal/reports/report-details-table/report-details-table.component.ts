import {Component, Input, OnInit} from '@angular/core';
import {ReportBasis} from '../../../shared/interfaces/report-basis';
import Utils from '../../../shared/helpers/utils';

@Component({
  selector: 'app-report-details-table',
  templateUrl: './report-details-table.component.html',
  styleUrls: ['./report-details-table.component.scss']
})
export class ReportDetailsTableComponent implements OnInit {

  utils = Utils;

  @Input() reports: ReportBasis[] = [];

  constructor() {
  }

  ngOnInit(): void {
  }

}
