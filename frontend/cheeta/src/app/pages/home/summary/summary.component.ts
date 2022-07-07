import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnInit {
  @Input() ticketSummary: any = [];

  headings = ['Backlog', 'Development', 'Testing', 'Done'];

  summary: any[] = [];

  constructor() {}

  ngOnInit(): void {
    this.summary = this.ticketSummary.filter((p: any) => {
      let flag = 0;
      p.backlog.forEach((t: any) => {
        if (t) flag++;
      });
      p.development.forEach((t: any) => {
        if (t) flag++;
      });
      p.testing.forEach((t: any) => {
        if (t) flag++;
      });
      p.done.forEach((t: any) => {
        if (t) flag++;
      });

      if (flag) return p;
    });
    // sort by amount of backlog tickets
    const sum = (arr: any) => arr.reduce((a: any, b: any) => a + b, 0);
    this.summary.sort((a: any, b: any) =>
      sum(a.backlog) === sum(b.backlog) ? 0: sum(a.backlog) > sum(b.backlog) ? -1: 1
    );
  }
}
