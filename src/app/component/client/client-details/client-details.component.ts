import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
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

@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.scss'],
})
export class ClientDetailsComponent implements OnInit {
  searchedText: string = '';
  consultingForm: FormGroup | any;
  client: any = {};
  feesOptions: any[] =  [
    {label : 'Paid' , value : true },
    {label : 'Unpaid' , value : false }
  ]
  isEditModal: boolean = false;
  clientConsultingTableData = { ...clientConsultingTableData };
  ConsultingDetails: boolean = false;
  @Select(ClientState.getSelectedClientData) getClientDetails$:
    | Observable<ClientModel[]>
    | undefined;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    public translate: TranslateService,
    private modalService: NgbModal,
    private router: Router,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private store: Store,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getClient();
    this.consultingForm = this.formBuilder.group({
      uuid: [''],
      date: ['', Validators.required],
      consulting: ['', Validators.required],
      paid: [''],
      fees :[0],
      consultingDescription: ['', Validators.required],
      resolution: ['', Validators.required],
      pDescription: ['', Validators.required],
    });
    this.activatedRoute.params.subscribe((params: any) => {
      this.store.dispatch(new ClientAction.getSelectedClient(params.id));
    });
  }

  getClient() {
    this.getClientDetails$
      ?.pipe(takeUntil(this.destroyed$), distinctUntilChanged())
      .subscribe((data: any) => {
        this.client = data;
      });
  }

  openDetails(item: any) {
    const data = {
      clientId: this.client.id,
      uuid: item.uuid,
    };
    const queryParams: any = { ...data };
    this.router.navigate(['clients-consulting'], { queryParams });
  }

  toggleDialogButton() {
    this.ConsultingDetails = !this.ConsultingDetails;
  }
  open() {
    this.isEditModal = false;
    this.resetDetails();
    this.toggleDialogButton();
  }

  submitDetails() {
    let payload: any = this.consultingForm.value || {};
    if (this.isEditModal) {
      const consulting = this.client?.consulting || [];
      const index = consulting?.findIndex((i: any) => i.uuid == payload.uuid);
      consulting[index] = payload;
      const client = { ...this.client, consulting };
      this.store.dispatch(
        new ClientAction.updateClient(client, client.id, true)
      );
    } else {
      payload.uuid = new Date().getTime().toString();
      const consult = [...(this.client?.consulting || []), payload];
      const client = { ...this.client, consulting: consult };
      this.store.dispatch(
        new ClientAction.updateClient(client, client.id, true)
      );
    }
    this.toggleDialogButton();
  }
  handleChange(event: any) {
    switch (event.type) {
      case 'EDIT':
        this.openEditModal(event.data);
        break;
      case 'DELETE':
        this.deleteRecord(event.data, this.client);
        break;
      case 'DETAILS':
        this.openDetails(event.data);
        break;
      default:
        break;
    }
  }
  resetDetails() {
    this.consultingForm.reset();
  }

  openEditModal(payload: any) {
    this.isEditModal = false;
    this.toggleDialogButton();
    this.resetDetails();
    this.consultingForm.patchValue(payload);
    this.isEditModal = true;
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
