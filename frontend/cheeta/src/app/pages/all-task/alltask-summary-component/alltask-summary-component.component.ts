import { Component, OnInit, Input } from '@angular/core';
import { CheetaTicketService } from 'src/app/service/cheetaTicket.service';

@Component({
  selector: 'app-alltask-summary-component',
  templateUrl: './alltask-summary-component.component.html',
  styleUrls: ['./alltask-summary-component.component.scss']
})
export class AlltaskSummaryComponentComponent implements OnInit {

  ticketSummary: any = [];

  headings = [
    "Backlog",
    "Development",
    "Testing",
    "Done"
  ]

  summary: any[] = []

  constructor(
    private cheetaTicketService: CheetaTicketService,
  ) { }

  async getTicketSummary() {
    let result: any = await this.cheetaTicketService.getTicketSummary();
    console.log(result)
    this.ticketSummary = result;

  }
  ngOnInit(): void {
    this.getTicketSummary().then(() => {
      console.log(this.ticketSummary)
      this.summary = this.ticketSummary.filter((p: any) => {
        let flag = 0;
        p.backlog.forEach((t: any) => {
          if (t) flag++;
        })
        p.development.forEach((t: any) => {
          if (t) flag++;
        })
        p.testing.forEach((t: any) => {
          if (t) flag++;
        })
        p.done.forEach((t: any) => {
          if (t) flag++;
        })

        if (flag) return p;
      })
    })

    // console.log(this.summary)
  }

}
