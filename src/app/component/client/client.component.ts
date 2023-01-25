import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { ConfirmationService, MessageService } from 'primeng/api';
import {
  distinctUntilChanged,
  Observable,
  ReplaySubject,
  takeUntil,
} from 'rxjs';

import ClientData from 'src/assets/json/client.json';
import { ClientAction, ClientModel, ClientState } from 'src/app/store/client';
import { AgePipe } from 'src/app/global-provider/pipes/age.pipe';

interface Client {
  id: number;
  name: string;
  age: number;
  date_of_birth: string;
  birth_time: string;
  phone_number: number;
  address: string;
  city: string;
  state: string;
  country: string;
  gender: string;
  email: string;
  consulting: object;
}

@Component({
  selector: 'app-clients',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss'],
  providers: [AgePipe],
})
export class ClientComponent implements OnInit {
  searchedText: string = '';
  clients: Client[] = [];
  ClientData = { ...ClientData };
  clientForm: FormGroup | any;
  detailsDialog: boolean = false;
  recordId: any;

  @Select(ClientState.getClient) getAllClient$:
    | Observable<ClientModel[]>
    | undefined;
  @Select(ClientState.searchClients) searchClients$:
    | Observable<String>
    | undefined;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private store: Store,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private agePipe: AgePipe
  ) {}

  ngOnInit(): void {
    this.getClients();
    this.getSearchedText();
    this.initForm();
  }

  initForm() {
    this.clientForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      date_of_birth: ['', Validators.required],
      birth_time: ['', Validators.required],
      address: ['', Validators.required],
      occupation: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
      gender: ['', Validators.required],
      email: [
        '',
        Validators.pattern(
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ),
      ],
      phone_number: ['', [Validators.pattern(/^\d{10}$/)]],
    });
  }

  getSearchedText() {
    this.searchClients$
      ?.pipe(takeUntil(this.destroyed$), distinctUntilChanged())
      .subscribe((data: any) => {
        this.searchedText = data;
      });
  }

  getClients() {
    this.getAllClient$
      ?.pipe(takeUntil(this.destroyed$), distinctUntilChanged())
      .subscribe((data: any) => {
        this.clients = data;
      });
    if (!this.clients) {
      this.store.dispatch(ClientAction.getAllClient);
    }
  }

  openDialog() {
    this.detailsDialog = !this.detailsDialog;
  }

  open() {
    this.recordId = null;
    this.resetDetails();
    this.openDialog();
  }

  get clientFormControl() {
    return this.clientForm.controls;
  }

  submitDetails() {
    const payload = this.clientForm.value;
    if (this.recordId) {
      payload.id = this.recordId;
      this.store.dispatch(
        new ClientAction.updateClient(payload, payload.id, false)
      );
      this.recordId = null;
    } else {
      payload.date = new Date().toISOString().slice(0, 10);
      this.store.dispatch(new ClientAction.addClient(payload));
    }
    this.openDialog();
  }

  resetDetails() {
    this.clientForm.reset();
  }

  openDetails(id: any) {
    this.router.navigate([`/clients/${id}`]);
  }

  openEditModal(payload: any) {
    this.recordId = null;
    this.resetDetails();
    this.openDialog();
    this.recordId = payload.id;
    this.clientForm.patchValue(payload);
  }

  deleteRecord(id: any) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this record?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.store.dispatch(new ClientAction.deleteClient(id));
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

  DetectChange(data: any) {
    switch (data.type) {
      case 'DETAILS':
        this.openDetails(data.data.id);
        break;
      case 'DELETE':
        this.deleteRecord(data.data.id);
        break;
      case 'EDIT':
        this.openEditModal(data.data);
        break;
      default:
        break;
    }
  }
}
