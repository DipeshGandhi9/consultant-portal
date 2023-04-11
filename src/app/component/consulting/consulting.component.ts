import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators , ReactiveFormsModule } from '@angular/forms';
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
import { dialogService } from 'src/app/shared-component/dialog/dialog-service/dialog.service';

@Component({
  selector: 'app-consulting',
  templateUrl: './consulting.component.html',
  styleUrls: ['./consulting.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConsultingComponent implements OnInit, OnDestroy {
  ConsultingTableData = {...ConsultingTableData}
  sortedList: any = [];
  @Select(ClientState.getClient) getAllClient$:
    | Observable<ClientModel[]>
    | undefined;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private router: Router,
    private store: Store,
    private confirmationService : ConfirmationService,
    private messageService : MessageService,
    private DialogService: dialogService
  ) {}

  ngOnInit(): void {
    this.getConsultingDetails();
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
                pDescription : consult.pDescription,
                consultingDescription_fontStyle: [data?.consultingDescription_fontStyle || ''],
                pDescription_fontStyle: [data?.pDescription_fontStyle || ''],
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


  open() {
    let payload:any = {
      isFromConsulting : true
    };
    this.DialogService.consultingDialog(undefined,payload);
  }


  openEditModal(payload: any) {
    payload.isFromConsulting = true;
    payload.isEdit = true;
    this.DialogService.consultingDialog(true,payload);
  }

  deleteRecord(payload: any,askInfo?:boolean) {
      this.confirmationService.confirm({
        message: 'Are you sure that you want to delete this record?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          const user:any = this.store.selectSnapshot(ClientState.getClient);
          const client = user.find((value:any)=> value.id == payload.id);
          const consulting = client?.consulting || [];
          const index = consulting?.findIndex((i: any) => new Date(payload.date).getTime() == new Date(i.date).getTime())
          consulting.splice(index, 1);
          client.consulting = consulting;
          this.store.dispatch(new ClientAction.updateClient(client, client.id,false));
        },
        reject: () => {
           this.messageService.add({severity:'info', summary:'Denied', detail:'You have Denied the confirmation'})
        }
      });
  }

  changeDetect(event:any) {
    switch (event.type) {
      case "EDIT":
        this.openEditModal(event.data)
        break;
      case "DELETE" :
        this.deleteRecord(event.data)
        break;
      default:
        break;
    }
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
  }
}
