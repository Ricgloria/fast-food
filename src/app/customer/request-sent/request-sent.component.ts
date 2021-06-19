import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-request-sent',
  templateUrl: './request-sent.component.html',
  styleUrls: ['./request-sent.component.scss']
})
export class RequestSentComponent implements OnInit {

  request: string | null = '';

  constructor(
    private activatedRoute: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.request = this.activatedRoute.snapshot.params?.request;
  }

}
