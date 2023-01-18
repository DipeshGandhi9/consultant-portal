import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Select, Store } from '@ngxs/store';
import {
  distinctUntilChanged,
  Observable,
  ReplaySubject,
  takeUntil,
} from 'rxjs';

import ConsultingTableData from 'src/assets/json/consulting.json';
import { ClientAction, ClientModel, ClientState } from 'src/app/store/client';

@Component({
  selector: 'app-consulting',
  templateUrl: './consulting.component.html',
  styleUrls: ['./consulting.component.scss'],
})
export class ConsultingComponent implements OnInit, OnDestroy {
  searchedText: string = '';
  detailsDialog : boolean = false;
  ConsultingTableData = {...ConsultingTableData}
  isEditModal: boolean = false;
  sortedList: any = [];
  selectedUser: any ;
  consultingForm: FormGroup | any;
  recordId: any;
  clients:any ;
  @Select(ClientState.getClient) getAllClient$:
    | Observable<ClientModel[]>
    | undefined;
  @Select(ClientState.searchClients) searchClients$:
    | Observable<String>
    | undefined;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private store: Store,
    private fb : FormBuilder
  ) {}

  ngOnInit(): void {
    this.getSearchedText();
    this.getConsultingDetails();
    this.initForm();
    this.getClients();
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

  getConsultingDetails() {
    if (this.getAllClient$) {
      this.getAllClient$
        .pipe(takeUntil(this.destroyed$), distinctUntilChanged())
        .subscribe((data: any) => {
          this.sortedList = [];
          data?.map((client: any) => {
            client?.consulting?.map((consult: any) => {
              this.sortedList.push({
                id: client.id,
                name: client.name,
                date: consult.date,
                illness: consult.illness,
                prescription: consult.prescription,
              });
            });
          });
          this.sortedList.sort((a: any, b: any) => {
            const t1: any = new Date(a.date);
            const t2: any = new Date(b.date);
            return t2 - t1;
          });
        });
      if (!this.sortedList || !this.sortedList.length) {
        this.store.dispatch(ClientAction.getAllClient);
      }
    }
  }
  getSearchedText() {
    this.searchClients$
      ?.pipe(takeUntil(this.destroyed$), distinctUntilChanged())
      .subscribe((data: any) => {
        this.searchedText = data;
      });
  }


  openDetails(item: any) {
    const details = this.sortedList.find(
      (c: any) => c.id == item.id && c.illness == item.illness
    );
    const queryParams: any = {};
    queryParams.myArray = JSON.stringify(details);
    this.router.navigate([`clients/consulting/${item.id}`], { queryParams });
  }
  initForm() {
      this.consultingForm = this.fb.group({
      selectedUser : ["",Validators.required],
      date: ["", Validators.required],
      illness: ["", Validators.required],
      illnessDescription:  ["", Validators.required],
      prescription: ["", Validators.required],
      pDescription:  ["", Validators.required],
    });
  }

  resetDetails() {
    this.consultingForm.reset();
  }

  toggleDialogButton() {
    this.detailsDialog = !this.detailsDialog;
  }

  open() {
    this.recordId = null;
    this.resetDetails();
    this.toggleDialogButton();
  }
  submitDetails() {
    let payload: any = this.consultingForm.value || {};
    if(this.isEditModal) {
      let selectedclient = this.selectedUser;
      const consulting = selectedclient?.consulting || [];
      const index = consulting?.findIndex((i: any) => new Date(payload.date).getTime() == new Date(i.date).getTime());
      consulting[index] = payload;
      const client = { ...selectedclient, consulting };
      this.store.dispatch(new ClientAction.updateClient(client, client.id,false));
    } else {
      let selectedclient = this.selectedUser;
      const consult = [ ...selectedclient?.consulting || [], payload];
      const client = { ...selectedclient, consulting: consult };
      this.store.dispatch(new ClientAction.updateClient(client, client.id,false));
    }
    this.toggleDialogButton();
  }

  openEditModal(payload: any) {
    this.isEditModal = false;
    this.toggleDialogButton();
    this.resetDetails();
    this.consultingForm.patchValue(payload);
    this.isEditModal = true;
  }

  changeDetect(event:any) {
    this.openDetails(event.data)
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
  }
}
