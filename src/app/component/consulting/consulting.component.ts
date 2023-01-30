import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import {
  distinctUntilChanged,
  Observable,
  ReplaySubject,
  takeUntil,
} from 'rxjs';

import ConsultingTableData from 'src/assets/json/consulting.json';
import { ClientAction, ClientModel, ClientState } from 'src/app/store/client';
import {ConfirmationService, MessageService} from 'primeng/api';

@Component({
  selector: 'app-consulting',
  templateUrl: './consulting.component.html',
  styleUrls: ['./consulting.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConsultingComponent implements OnInit, OnDestroy {
  searchedText: string = '';
  detailsDialog : boolean = false;
  ConsultingTableData = {...ConsultingTableData}
  isEditModal: boolean = false;
  sortedList: any = [];
  editData : any ;
  consultingForm: FormGroup | any;
  recordId: any;
  feesOptions: any[] =  [
    {label : 'Paid' , value : true },
    {label : 'Unpaid' , value : false }
  ]
  clients:any ;
  @Select(ClientState.getClient) getAllClient$:
    | Observable<ClientModel[]>
    | undefined;
  @Select(ClientState.searchClients) searchClients$:
    | Observable<String>
    | undefined;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  selectedFont: string = "Arial";

  constructor(
    private router: Router,
    private store: Store,
    private fb : FormBuilder,
    private confirmationService : ConfirmationService,
    private messageService : MessageService
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
          item.name = item.first_name + " " + item.last_name;
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
                first_name : client.first_name,
                last_name : client.last_name,
                fees:consult.fees,
                uuid : consult.uuid,
                paid : consult.paid, 
                date: consult.date,
                consulting: consult.consulting,
                resolution: consult.resolution,
                consultingDescription : consult.consultingDescription,
                pDescription : consult.pDescription
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
    const data = {
      clientId : item.id,
      uuid: item.uuid
    }
    const queryParams: any = {...data};
    this.router.navigate(['clients-consulting'], { queryParams });
  }

  initForm() {
      this.consultingForm = this.fb.group({
      id : ["",Validators.required],
      uuid:[""],
      date: ["", Validators.required],
      consulting: ["", Validators.required],
      consultingDescription:  [""],
      resolution: ["", Validators.required],
      pDescription:  [""],
      paid:[''],
      fees:['']
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
    const user:any = this.store.selectSnapshot(ClientState.getClient);
    const selectedclient = user.find((value:any)=> value.id == payload.id);
    if(this.isEditModal) {
      this.isEditModal = false;
      const consulting = selectedclient?.consulting || [];
      const index = consulting?.findIndex((i: any) => i.uuid == payload.uuid);
      if (index < 0) {
        this.deleteRecord(payload,true);
        this.editData = null;
        delete payload['id'];

        const consult = [ ...selectedclient?.consulting || [], payload];
        const client = { ...selectedclient, consulting: consult };
        this.store.dispatch(new ClientAction.updateClient(client, client.id,false));
      } else {
        delete payload['id'];
        consulting[index] = payload;
        const client = { ...selectedclient, consulting };
        this.store.dispatch(new ClientAction.updateClient(client, client.id,false));
      }
    } else {
      delete payload['id'];
      payload.uuid = new Date().getTime().toString();
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
    this.editData = payload;
    this.consultingForm.patchValue(payload);
    this.isEditModal = true;
  }

  deleteRecord(payload: any,askInfo?:boolean) {
    if (!askInfo) {
      this.confirmationService.confirm({
        message: 'Are you sure that you want to delete this record?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          if (this.editData && payload.id != this.editData.id) {
            payload.id = this.editData.id;
          }
          const user:any = this.store.selectSnapshot(ClientState.getClient);
          const client = user.find((value:any)=> value.id == payload.id);
          const consulting = client?.consulting || [];
          const index = consulting?.findIndex((i: any) => new Date(payload.date).getTime() == new Date(i.date).getTime())
          consulting.splice(index, 1);
          client.consulting = consulting;
          if (this.editData) {
            this.store.dispatch(new ClientAction.updateClient(client, client.id,false,true));
          } else {
            this.store.dispatch(new ClientAction.updateClient(client, client.id,false));
          }
        },
        reject: () => {
           this.messageService.add({severity:'info', summary:'Denied', detail:'You have Denied the confirmation'})
        }
      });
    }  else {
      if (this.editData && payload.id != this.editData.id) {
        payload.id = this.editData.id;
      }
      const user:any = this.store.selectSnapshot(ClientState.getClient);
      const client = user.find((value:any)=> value.id == payload.id);
      const consulting = client?.consulting || [];
      const index = consulting?.findIndex((i: any) => new Date(payload.date).getTime() == new Date(i.date).getTime())
      consulting.splice(index, 1);
      client.consulting = consulting;
      if (this.editData) {
        this.store.dispatch(new ClientAction.updateClient(client, client.id,false,true));
      } else {
        this.store.dispatch(new ClientAction.updateClient(client, client.id,false));
      }
    }
  }

  changeDetect(event:any) {
    switch (event.type) {
      case "EDIT":
        this.openEditModal(event.data)
        break;
      case "DELETE" :
        this.deleteRecord(event.data)
        break;
      case "DETAILS" :
        this.openDetails(event.data)
        break;  
      default:
        break;
    }
  }

  onFontChange(event: any) {
    this.selectedFont = event.target.value;
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
  }
}
