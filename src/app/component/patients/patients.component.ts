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

import { PatientsAction, PatientsModel, PatientsState } from 'src/app/store/patients';

interface Client {
  id: number;
  name: string;
  age: number;
  dob: string;
  phoneNumber: number;
  location: string;
  gender: string;
  email: string;
  consulting: object;
}

@Component({
  selector: "app-patients",
  templateUrl: "./patients.component.html",
  styleUrls: ["./patients.component.scss"],
})
export class PatientsComponent implements OnInit {
  searchedText: string = "";
  clients: Client[] = [];
  clientForm: FormGroup | any;
  recordId: any;

  @Select(PatientsState.getPatients) getAllClient$:
    | Observable<PatientsModel[]>
    | undefined;
  @Select(PatientsState.searchClients) searchClients$:  Observable<String> | undefined;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private router: Router,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.getPatients();
    this.getSearchedText();
    this.clientForm = this.formBuilder.group({
      name: ["", Validators.required],
      dob: ["", Validators.required],
      location: ["", Validators.required],
      gender: ["", Validators.required],
      email: ["", Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)],
      phoneNumber: ["", [Validators.required, Validators.pattern(/^\d{10}$/)]],
    });
  }

  getSearchedText() {
    this.searchClients$?.pipe(takeUntil(this.destroyed$), distinctUntilChanged())
    .subscribe((data: any) => {
      this.searchedText = data;
    });
  }
  
  getPatients() {
    this.store.dispatch(PatientsAction.getAllPatients);
    this.getAllClient$
      ?.pipe(takeUntil(this.destroyed$), distinctUntilChanged())
      .subscribe((data: any) => {
        data?.map((item: any) => {
          var diff_ms = Date.now() - new Date(item.dob).getTime();
          var age_dt = new Date(diff_ms);
          const age = Math.abs(age_dt.getUTCFullYear() - 1970);
          item.age = age;
        });
        this.clients = data;
      });
  }

  open(item: any) {
    this.recordId = null;
    this.resetDetails();
    this.modalService.open(item, { ariaLabelledBy: "modal-basic-title" });
  }

  get clientFormControl() {
    return this.clientForm.controls;
  }

  submitDetails() {
    const payload = this.clientForm.value;
    if(this.recordId) {
      payload.id = this.recordId;
    this.store.dispatch(new PatientsAction.updatePatients(payload, payload.id));
    } else {
      this.store.dispatch(new PatientsAction.addPatients(payload));
    }
  }

  resetDetails() {
    this.clientForm.reset();
  }

  openDetails(id: any) {
    this.router.navigate([`/clients/${id}`]);
  }

  openEditModal(item: any, payload: any) {
    this.recordId = null;
    this.resetDetails();
    this.modalService.open(item, { ariaLabelledBy: "modal-basic-title" });
    this.recordId = payload.id;
    this.clientForm.patchValue(payload);
  }

  deleteRecord(id: any) {
    this.store.dispatch(new PatientsAction.deletePatients(id));
  }
}
