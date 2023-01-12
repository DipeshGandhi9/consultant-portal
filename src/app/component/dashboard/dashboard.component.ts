import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Select, Store } from '@ngxs/store';
import { distinctUntilChanged, Observable, ReplaySubject, takeUntil } from 'rxjs';

import { PatientsAction, PatientsModel, PatientsState } from 'src/app/store/patients';

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
  
  @Select(PatientsState.getPatients) getAllClient$:
    | Observable<PatientsModel[]>
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
    this.store.dispatch(PatientsAction.getAllPatients);
    this.getAllClient$
      ?.pipe(takeUntil(this.destroyed$), distinctUntilChanged())
      .subscribe((data: any) => {
        if(data?.length) {
          this.clients = data;
          setTimeout(() => {
            this.calculate();
          }, 1000);
        }
      });
  }

  calculate() {
    this.totalClients = this.clients?.length;
    let todaysClients: any = [], topDiseases: any = [], todaysTopDiseases: any = [];
    this.clients?.map((client: any) => {
      client?.consulting?.map((item: any) => {
        const d1: any = new Date()
        const d2: any = new Date(item.date);
        d1.setHours(0,0,0,0);
        d2.setHours(0,0,0,0);
        if(d1.getTime() == d2.getTime()) {
          todaysClients.push(client);
          todaysTopDiseases.push(item.illness);
        } else {
          topDiseases.push(item.illness);
        }
      });
    })
    this.totalTodaysClients = todaysClients.length;
    this.totalTopDiseases = this.getFrequentItem(topDiseases);
    this.totalTodaysTopDiseases = this.getFrequentItem(todaysTopDiseases);
  }

  getFrequentItem(arr: any = []) {
    const mode = arr.sort((a: any, b: any) => {
      return arr.filter((v: any) => v === a).length - arr.filter((v: any) => v === b).length
    }).pop();
    return mode;
  }
}
