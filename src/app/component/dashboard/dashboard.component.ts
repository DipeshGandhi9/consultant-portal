import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Select, Store } from '@ngxs/store';
import { distinctUntilChanged, Observable, ReplaySubject, takeUntil } from 'rxjs';

import { ClientAction, ClientModel, ClientState } from 'src/app/store/client';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  
  clients: any = [];
  totalClients: Number = 0;
  totalTodaysClients: Number = 0;
  totalTopDiseases: String = "";
  totalTodaysTopDiseases: String = "";
  
  @Select(ClientState.getClient) getAllClient$:
    | Observable<ClientModel[]>
    | undefined;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  
  constructor(
    public translate: TranslateService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.getClients();
  }

  getClients() {
    this.store.dispatch(ClientAction.getAllClient);
    this.getAllClient$
      ?.pipe(takeUntil(this.destroyed$), distinctUntilChanged())
      .subscribe((data: any) => {
        if(data?.length) {
          this.clients = data;
          this.calculate();
        }
      });
  }

  calculate() {
    this.totalClients = this.clients?.length;
    let todaysClients: any = [], topDiseases: any = [], todaysTopDiseases: any = 0,totalConsultent:any = 0;
    this.clients?.map((client: any) => {
      const d1: any = new Date()
        const d2: any = new Date(client.date);
        d1.setHours(0,0,0,0);
        d2.setHours(0,0,0,0);
        if (d1.getTime() == d2.getTime()) {
          todaysClients.push(client);
        }
        client?.consulting?.map((item: any) => {
          const d1: any = new Date()
          const d2: any = new Date(item.date);
          d1.setHours(0,0,0,0);
          d2.setHours(0,0,0,0);
          totalConsultent = totalConsultent+1;
        if(d1.getTime() == d2.getTime()) {
          todaysTopDiseases = todaysTopDiseases +1  ;
        } else {
          topDiseases.push(item.consulting);
        }
      });
    })
    this.totalTodaysClients = todaysClients.length;
    this.totalTopDiseases = totalConsultent ;
    this.totalTodaysTopDiseases = todaysTopDiseases;
  }

  getFrequentItem(arr: any = []) {
    const mode = arr.sort((a: any, b: any) => {
      return arr.filter((v: any) => v === a).length - arr.filter((v: any) => v === b).length
    }).pop();
    return mode;
  }
}
