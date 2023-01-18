import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Select, Store } from '@ngxs/store';
import { distinctUntilChanged, Observable, ReplaySubject, takeUntil } from 'rxjs';

import clientConsultingTableData from 'src/assets/json/client-consulting.json';
import { ClientAction, ClientModel, ClientState } from 'src/app/store/client';

// export const QuillConfiguration = {
//   toolbar: [
//     ['bold', 'italic', 'underline', 'strike'],
//     ['blockquote', 'code-block'],
//     [{ list: 'ordered' }, { list: 'bullet' }],
//     [{ header: [1, 2, 3, 4, 5, 6, false] }],
//     [{ color: [] }, { background: [] }],
//     ['link'],
//     ['clean'],
//   ],
// }
@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.scss']
})
export class ClientDetailsComponent implements OnInit {

  searchedText: string = "";
  consultingForm: FormGroup | any;
  client: any = {};
  isEditModal: boolean = false;
  clientConsultingTableData = {...clientConsultingTableData};
  ConsultingDetails : boolean = false ;
  // quillConfiguration = QuillConfiguration
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
    private store: Store
  ) { }

  ngOnInit(): void {
    this.getClient();
    this.consultingForm = this.formBuilder.group({
      date: ["", Validators.required],
      illness: ["", Validators.required],
      illnessDescription:  ["", Validators.required],
      prescription: ["", Validators.required],
      pDescription:  ["", Validators.required],
    });
    this.activatedRoute.params.subscribe((params:any)=>{
      console.log(params)
      this.store.dispatch(new ClientAction.getSelectedClient(params.id));
    })
  }

  getClient() {
    this.getClientDetails$?.pipe(takeUntil(this.destroyed$), distinctUntilChanged())
    .subscribe((data: any) => {
      this.client = data;
    });
  }

  openDetails(item: any) {
    const queryParams: any = {};
    queryParams.myArray = JSON.stringify(item);
    this.router.navigate([`clients/consulting/${this.client.id}`], { queryParams });
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
    if(this.isEditModal) {
      debugger
      const consulting = this.client?.consulting || [];
      const index = consulting?.findIndex((i: any) => new Date(payload.date).getTime() == new Date(i.date).getTime());
      consulting[index] = payload;
      const client = { ...this.client, consulting };
      this.store.dispatch(new ClientAction.updateClient(client, client.id,true));
    } else {
      const consult = [ ...this.client?.consulting || [], payload];
      const client = { ...this.client, consulting: consult };
      this.store.dispatch(new ClientAction.updateClient(client, client.id,true));
    }
    this.toggleDialogButton();
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
    const consulting = client?.consulting || [];
    const index = consulting?.findIndex((i: any) => new Date(payload.date).getTime() == new Date(i.date).getTime())
    consulting.splice(index, 1);
    client.consulting = consulting;
    this.store.dispatch(new ClientAction.updateClient(client, client.id,true));
  }
}
