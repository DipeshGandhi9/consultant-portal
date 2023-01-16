import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Select, Store } from "@ngxs/store";
import {
  distinctUntilChanged,
  Observable,
  ReplaySubject,
  takeUntil,
} from "rxjs";

import { ClientAction, ClientModel, ClientState } from 'src/app/store/client';

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
  selector: "app-clients",
  templateUrl: "./client.component.html",
  styleUrls: ["./client.component.scss"],
})
export class ClientComponent implements OnInit {
  searchedText: string = "";
  clients: Client[] = [];
  clientForm: FormGroup | any;
  detailsDialog: boolean = false;
  recordId: any;

  @Select(ClientState.getClient) getAllClient$:
    | Observable<ClientModel[]>
    | undefined;
  @Select(ClientState.searchClients) searchClients$:  Observable<String> | undefined;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private router: Router,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.getClients();
    this.getSearchedText();
    this.initForm();
   
  }

  initForm() {
    this.clientForm = this.fb.group({
      firstName : [""],
      lastName :  [""],
      name: ["", Validators.required],
      date_of_birth: ["", Validators.required],
      birth_time: ["", Validators.required],
      address: ["", Validators.required],
      city: ["", Validators.required],
      state: ["", Validators.required],
      country: ["", Validators.required],
      gender: ["", Validators.required],
      email: ["", Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)],
      phone_number: ["", [Validators.required, Validators.pattern(/^\d{10}$/)]],
    });
  }

  getSearchedText() {
    this.searchClients$?.pipe(takeUntil(this.destroyed$), distinctUntilChanged())
    .subscribe((data: any) => {
      this.searchedText = data;
    });
  }
  
  getClients() {
    this.store.dispatch(ClientAction.getAllClient);
    this.getAllClient$
      ?.pipe(takeUntil(this.destroyed$), distinctUntilChanged())
      .subscribe((data: any) => {
        data?.map((item: any) => {
          var diff_ms = Date.now() - new Date(item.date_of_birth).getTime();
          var age_dt = new Date(diff_ms);
          const age = Math.abs(age_dt.getUTCFullYear() - 1970);
          item.age = age;
        });
        this.clients = data;
      });
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
    if(this.recordId) {
      payload.id = this.recordId;
    this.store.dispatch(new ClientAction.updateClient(payload, payload.id, false));
    } else {
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
    this.store.dispatch(new ClientAction.deleteClient(id));
  }
}
