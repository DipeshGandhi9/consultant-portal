import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Select, Store } from '@ngxs/store';
import {
  distinctUntilChanged,
  Observable,
  ReplaySubject,
  takeUntil,
} from 'rxjs';

import clientConsultingTableData from 'src/assets/json/client-consulting.json';
import { ClientAction, ClientModel, ClientState } from 'src/app/store/client';
import { ConfirmationService, MessageService } from 'primeng/api';
import { dialogService } from 'src/app/shared-component/dialog/dialog-service/dialog.service';

@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.scss'],
})
export class ClientDetailsComponent implements OnInit {
  client: any = {};
  clientConsultingTableData = { ...clientConsultingTableData };
  @Select(ClientState.getSelectedClientData) getClientDetails$:
    | Observable<ClientModel[]>
    | undefined;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    public translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private store: Store,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private DialogService:dialogService,
    private _location:Location,
  ) {}

  ngOnInit(): void {
    this.getClient();
    this.activatedRoute.params.subscribe((params: any) => {
      this.store.dispatch(new ClientAction.getSelectedClient(params.id));
    });
  }

  getClient() {
    this.getClientDetails$
      ?.pipe(takeUntil(this.destroyed$), distinctUntilChanged())
      .subscribe((data: any) => {
        data?.consulting?.map((value:any)=>{
          value.id = data.id 
        })
        this.client = data;
      });
  }

  goBack() {
    this._location.back();
  }
  
  open() {
    const payload = {
      id : this.client.id,
    }
    this.DialogService.consultingDialog(false,payload)
  }

  handleChange(event: any) {
    switch (event.type) {
      case 'EDIT':
        this.openEditModal(event.data);
        break;
      case 'DELETE':
        this.deleteRecord(event.data, this.client);
        break;
      default:
        break;
    }
  }

  openEditModal(payload: any) {
    payload.isEdit = true;
    this.DialogService.consultingDialog(true,payload)
  }

  deleteRecord(payload: any, client: any) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this record?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const consulting = client?.consulting || [];
        const index = consulting?.findIndex((i: any) => i.uuid == payload.uuid);
        consulting.splice(index, 1);
        client.consulting = consulting;
        this.store.dispatch(
          new ClientAction.updateClient(client, client.id, true)
        );
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Denied',
          detail: 'You have Denied the confirmation',
        });
      },
    });
  }
}
