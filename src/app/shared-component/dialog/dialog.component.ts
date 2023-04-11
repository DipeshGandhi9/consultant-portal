import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
// import { Observable } from 'dexie';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import {
  distinctUntilChanged,
  Observable,
  takeUntil,
  pipe,
  ReplaySubject,
} from 'rxjs';
import { ClientAction, ClientModel, ClientState } from 'src/app/store/client';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit {
  @Select(ClientState.getClient) getAllClient$:
    | Observable<ClientModel[]>
    | undefined;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  consultingForm!: FormGroup;
  isFromConsulting: boolean = this.config?.data?.isFromConsulting;
  isEdit: boolean;
  clients: any;
  feesOptions = [
    { label: 'Paid', value: true },
    { label: 'Unpaid', value: false },
  ];
  constructor(
    private fb: FormBuilder,
    public dialogRef: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public store: Store
  ) {}

  ngOnInit(): void {
    this.isEdit = this.config?.data?.isEdit ?  this.config?.data?.isEdit : false
    this.initFormFields(this.config?.data);
    if (this.isFromConsulting) {
      this.getClient();
    }
    this.store.dispatch(new ClientAction.getAllClient());
  }

  getClient() {
    this.store.dispatch(ClientAction.getAllClient);
    this.getAllClient$
      ?.pipe(takeUntil(this.destroyed$), distinctUntilChanged())
      .subscribe((data: any) => {
        data?.map((item: any) => {
          item.name = item.first_name + ' ' + item.last_name;
        });
        this.clients = data;
      });
  }

  initFormFields(data: any) {
    console.log('data', data);
    this.consultingForm = this.fb.group({
      id: [data?.id || ''],
      uuid: [data?.uuid || ''],
      date: [data?.date || '', Validators.required],
      consulting: [data?.consulting || '', Validators.required],
      consultingDescription: [data?.consultingDescription || ''],
      resolution: [data?.resolution || '', Validators.required],
      pDescription: [data?.pDescription || ''],
      paid: [data?.paid || ''],
      fees: [data?.fees || ''],
      consultingDescription_fontStyle: [data?.consultingDescription_fontStyle || ''],
      pDescription_fontStyle: [data?.pDescription_fontStyle || ''],
    });
  }
  resetDetails() {
    this.consultingForm.reset();
  }

  submitDetails() {
    let payload: any = this.consultingForm.value || {};
    const user: any = this.store.selectSnapshot(ClientState.getClient);
    const selectedclient = user.find((value: any) => value.id == payload.id);
    if (this.isEdit) {
      const consulting = selectedclient?.consulting || [];
      const index = consulting?.findIndex((i: any) => i.uuid == payload.uuid);
      if (index < 0) {
        this.deleteRecord(payload);
        delete payload['id'];

        const consult = [...(selectedclient?.consulting || []), payload];
        const client = { ...selectedclient, consulting: consult };
        this.store.dispatch(
          new ClientAction.updateClient(client, client.id, false)
        );
      } else {
        delete payload['id'];
        consulting[index] = payload;
        const client = { ...selectedclient, consulting };
        this.store.dispatch(
          new ClientAction.updateClient(client, client.id, false)
        );
      }
    } else {
      delete payload['id'];
      payload.uuid = new Date().getTime().toString();
      const consult = [...(selectedclient?.consulting || []), payload];
      const client = { ...selectedclient, consulting: consult };
      if (this.isFromConsulting) {
        this.store.dispatch(
          new ClientAction.updateClient(client, client.id, false)
        );
      } else {
        this.store.dispatch(
          new ClientAction.updateClient(client, client.id, true)
        );
      }
    }
    this.store.dispatch(ClientAction.getAllClient);
    this.dialogRef.close(true);
  }

  deleteRecord(payload: any) {
    if (this.config.data && payload.id != this.config.data.id) {
      payload.id = this.config.data.id;
    }
    const user: any = this.store.selectSnapshot(ClientState.getClient);
    const client = user.find((value: any) => value.id == payload.id);
    const consulting = client?.consulting || [];
    const index = consulting?.findIndex(
      (i: any) => new Date(payload.date).getTime() == new Date(i.date).getTime()
    );
    consulting.splice(index, 1);
    client.consulting = consulting;
    if (this.config?.data) {
      this.store.dispatch(
        new ClientAction.updateClient(client, client.id, false, true)
      );
    } else {
      this.store.dispatch(
        new ClientAction.updateClient(client, client.id, false)
      );
    }
  }
}
