import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';
import { Select, Store } from '@ngxs/store';
import { distinctUntilChanged, Observable, ReplaySubject, takeUntil } from 'rxjs';

import { ClientAction, ClientModel, ClientState } from 'src/app/store/client';
@Component({
  selector: 'app-consulting-details',
  templateUrl: './consulting-details.component.html',
  styleUrls: ['./consulting-details.component.scss']
})
export class ConsultingDetailsComponent implements OnInit, OnDestroy {

  clientData: any = {};
  selectedConsulting : any = {};
  clientId : string;
  uuid: string;
  initial:any ;
  @ViewChild('content', {static: false}) content: ElementRef;
  @Select(ClientState.getSelectedClientData) getClientDetails$:
  | Observable<ClientModel[]>
  | undefined;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);


  constructor(
    public translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private _location:Location,
    private store : Store
  ) { }

  ngOnInit(): void {
    this.getClientId();
  }

  getClientId() {
    this.activatedRoute.queryParams.pipe(takeUntil(this.destroyed$),distinctUntilChanged()).subscribe((data:any)=>{
      this.clientId = data.clientId;
      this.uuid = data.uuid;
      this.getClidentDetails();
    });
  }

  getClidentDetails() {
    this.store.dispatch(new ClientAction.getSelectedClient(this.clientId));
    this.getClientDetails$?.pipe(takeUntil(this.destroyed$),distinctUntilChanged()).subscribe((data:any)=>{
      this.clientData = data; 
      this.initial = this.clientData?.first_name[0]+ this.clientData?.last_name[0] || "";  
      this.selectedConsulting = data?.consulting?.find((value:any)=> value.uuid == this.uuid);
    })
  }

  goBack() {
    this._location.back();
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
  }

}
