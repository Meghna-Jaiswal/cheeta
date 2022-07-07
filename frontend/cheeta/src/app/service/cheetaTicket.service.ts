import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { Ticket } from 'src/app/models/ticket.model';
import { environment } from 'src/environments/environment';
import { CheetaUsersService } from './cheetaUsers.service';

const TICKET_BASE_URL = environment.ticketUrl;

@Injectable({
  providedIn: 'root',
})
export class CheetaTicketService {
  private ticketUpdated = new Subject<any>();

  constructor(
    private http: HttpClient,
    private router: Router,
    public cheetaUserService: CheetaUsersService
  ) {}

  getTicketUpdateListener() {
    return this.ticketUpdated.asObservable();
  }

  //this ir to create a ticket from create option
  async addTicket(ticket: any) {
    const userDetails: any = await this.cheetaUserService.getUserData();
    console.log(userDetails);
    return new Promise((resolve, reject) => {
      try {
        ticket['user'] = {
          userId: localStorage.getItem('userId'),
          type: userDetails.data.type,
          email: userDetails.data.email,
          name: userDetails.data.name,
          profilePic: userDetails.data.profilePic,
        };
        console.log(ticket);
        this.http
          .post(TICKET_BASE_URL + 'createTicket', ticket)
          .subscribe(async (res) => {
            this.ticketUpdated.next(1);
            resolve(res);
          });
      } catch (err) {}
    });
  }

  //this is for getting all tickets from backend to kan ban page
  public getTickets(filters: any) {
    console.log(filters);
    return new Promise((resolve, reject) => {
      try {
        this.http
          .post(TICKET_BASE_URL + 'getTickets', filters)
          .subscribe(async (res: any) => {
            if (res.data && res.data.length) {
              resolve(res.data);
            } else resolve([]);
          });
      } catch (err) {
        console.log(err);
      }
    });
  }

  //changes state of a ticket in kanban saction from backlog to development or deployment or done
  async updateTicketState(ticket: any, changes: any) {
    return new Promise((resolve, reject) => {
      try {
        this.http
          .put(TICKET_BASE_URL + 'changeTicketState/' + ticket._id, changes)
          .subscribe((res: any) => {
            console.log(res);
            if (res && res.data) resolve(res);
            else reject('User not allowed to make this change!');
          });
      } catch (err) {
        console.log(err);
        reject(err);
      }
    });
  }

  //function to delete tickets
  public deleteTicket(eventId: string) {
    console.log(eventId);
    return new Promise((resolve, reject) => {
      try {
        this.http
          .delete(TICKET_BASE_URL + 'deleteTicket/' + eventId)
          .subscribe(async (res) => {
            this.ticketUpdated.next(1);
            resolve(res);
          });
      } catch (err) {
        reject(err);
      }
    });
  }

  //function to update ticket details
  public updateTicket(id: string, ticket: any, comment = false) {
    return new Promise((resolve, reject) => {
      this.http.put(TICKET_BASE_URL + 'updateTicket/' + id, ticket).subscribe(
        async (res) => {
          if (!comment) this.ticketUpdated.next(1);
          resolve(res);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  searchTicket(term: any) {
    return new Promise((resolve, reject) => {
      this.http.get(TICKET_BASE_URL + 'search?term=' + term).subscribe(
        async (res: any) => {
          // this.ticketUpdated.next(1);
          // console.log(res)
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  //function used in home page forshowing all ticketsummary table
  ticketSummary: any = [];

  cacheTime = 5000;
  public getTicketSummary() {
    return new Promise((resolve, reject) => {
      // return resolve(aa)
      try {
        if (this.ticketSummary.length > 0) return resolve(this.ticketSummary);
        this.ticketSummary = [];
        this.http.get(TICKET_BASE_URL + 'getTicketSummary').subscribe(
          (res: any) => {
            if (res && res['data']) {
              // console.log(res);
              let t: any;
              t = res['data'];
              for (let i = 0; i < t.length; i++) {
                let obj: any = {};
                obj['project'] = Object.keys(t[i])[0];
                obj['backlog'] = [0, 0, 0, 0];
                obj['development'] = [0, 0, 0, 0];
                obj['testing'] = [0, 0, 0, 0];
                obj['done'] = [0, 0, 0, 0];

                for (let j = 0; j < t[i][obj['project']].length; j++) {
                  let a = t[i][obj['project']];

                  if (a[j]._id == 'backlog') {
                    let count = a[j].ticketsCount;

                    for (let k = 0; k < count.length; k++) {
                      if (
                        count[k].priority == 'P0' ||
                        count[k].priority == 'p0'
                      )
                        obj['backlog'][0] = count[k].count;
                      if (
                        count[k].priority == 'P1' ||
                        count[k].priority == 'p1'
                      )
                        obj['backlog'][1] = count[k].count;
                      if (
                        count[k].priority == 'P2' ||
                        count[k].priority == 'p2'
                      )
                        obj['backlog'][2] = count[k].count;
                      if (
                        count[k].priority == 'P3' ||
                        count[k].priority == 'p3'
                      )
                        obj['backlog'][3] = count[k].count;
                    }
                  }

                  if (a[j]._id == 'development') {
                    let count = a[j].ticketsCount;

                    for (let k = 0; k < count.length; k++) {
                      if (
                        count[k].priority == 'P0' ||
                        count[k].priority == 'p0'
                      )
                        obj['development'][0] = count[k].count;
                      if (
                        count[k].priority == 'P1' ||
                        count[k].priority == 'p1'
                      )
                        obj['development'][1] = count[k].count;
                      if (
                        count[k].priority == 'P2' ||
                        count[k].priority == 'p2'
                      )
                        obj['development'][2] = count[k].count;
                      if (
                        count[k].priority == 'P3' ||
                        count[k].priority == 'p3'
                      )
                        obj['development'][3] = count[k].count;
                    }
                  }

                  if (a[j]._id == 'testing') {
                    let count = a[j].ticketsCount;

                    for (let k = 0; k < count.length; k++) {
                      if (
                        count[k].priority == 'P0' ||
                        count[k].priority == 'p0'
                      )
                        obj['testing'][0] = count[k].count;
                      if (
                        count[k].priority == 'P1' ||
                        count[k].priority == 'p1'
                      )
                        obj['testing'][1] = count[k].count;
                      if (
                        count[k].priority == 'P2' ||
                        count[k].priority == 'p2'
                      )
                        obj['testing'][2] = count[k].count;
                      if (
                        count[k].priority == 'P3' ||
                        count[k].priority == 'p3'
                      )
                        obj['testing'][3] = count[k].count;
                    }
                  }

                  if (a[j]._id == 'done') {
                    let count = a[j].ticketsCount;

                    for (let k = 0; k < count.length; k++) {
                      if (
                        count[k].priority == 'P0' ||
                        count[k].priority == 'p0'
                      )
                        obj['done'][0] = count[k].count;
                      if (
                        count[k].priority == 'P1' ||
                        count[k].priority == 'p1'
                      )
                        obj['done'][1] = count[k].count;
                      if (
                        count[k].priority == 'P2' ||
                        count[k].priority == 'p2'
                      )
                        obj['done'][2] = count[k].count;
                      if (
                        count[k].priority == 'P3' ||
                        count[k].priority == 'p3'
                      )
                        obj['done'][3] = count[k].count;
                    }
                  }
                }

                this.ticketSummary.push(obj);
              }

              // console.log(this.ticketSummary)
              setTimeout(() => {
                this.ticketSummary = [];
              }, this.cacheTime);
              return resolve(this.ticketSummary);
            }
            reject(new Error('data is not there'));
          },
          (error) => {
            reject(error);
          }
        );
      } catch (err) {
        console.log(err);
      }
    });
  }

  async onSearch() {
    let smallTask = [];
    let bigTask = [];
    const filters = {
      members: [localStorage.getItem('userId')],
    };

    let result: any = await this.getTickets(filters);

    const userDetails: any = await this.cheetaUserService.getUserData();
    let userType = '';
    if (userDetails) userType = userDetails.data.type;
    else return;

    if (userType == 'software-developer') {
      result.forEach((t: any) => {
        if (t.state != 'development') return;
        if (t.type == 'small') smallTask.push(t);
        if (t.type == 'big') bigTask.push(t);
      });
    } else if (userType == 'quality-analyst') {
      result.forEach((t: any) => {
        if (t.state != 'testing') return;
        if (t.type == 'small') smallTask.push(t);
        if (t.type == 'big') bigTask.push(t);
      });
    } else {
      result.forEach((t: any) => {
        if (t.state == 'deployed') return;
        if (t.type == 'small') smallTask.push(t);
        if (t.type == 'big') bigTask.push(t);
      });
    }
  }
}
