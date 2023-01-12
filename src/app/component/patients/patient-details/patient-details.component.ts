import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Select, Store } from '@ngxs/store';
import { distinctUntilChanged, Observable, ReplaySubject, takeUntil } from 'rxjs';

import { PatientsAction, PatientsModel, PatientsState } from 'src/app/store/patients';

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
  selector: 'app-patient-details',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.scss']
})
export class PatientDetailsComponent implements OnInit {

  searchedText: string = "";
  consultingForm: FormGroup | any;
  client: any = {};
  isEditModal: boolean = false;
  // quillConfiguration = QuillConfiguration
  @Select(PatientsState.getPatients) getAllClient$:
  | Observable<PatientsModel[]>
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
    this.getPatients();
    this.consultingForm = this.formBuilder.group({
      date: ["", Validators.required],
      illness: ["", Validators.required],
      illnessDescription:  ["", Validators.required],
      prescription: ["", Validators.required],
      pDescription:  ["", Validators.required],
    });
  }

  getPatients() {
    this.store.dispatch(PatientsAction.getAllPatients);
    this.getAllClient$?.pipe(takeUntil(this.destroyed$), distinctUntilChanged())
    .subscribe((data: any) => {
      const id: any = this.activatedRoute.snapshot.paramMap.get('id');
      this.client = data?.filter((d: any) => d.id == id)[0] || {};
    });
  }

  openDetails(item: any) {
    const queryParams: any = {};
    queryParams.myArray = JSON.stringify(item);
    this.router.navigate([`clients/consulting/${this.client.id}`], { queryParams });
  }

  open(item: any) {
    this.isEditModal = false;
    this.resetDetails();
    this.modalService.open(item, { ariaLabelledBy: "modal-basic-title" });
  }

  submitDetails() {
    let payload: any = this.consultingForm.value || {};
    if(this.isEditModal) {
      const consulting = this.client?.consulting || [];
      const index = consulting?.findIndex((i: any) => new Date(payload.date).getTime() == new Date(i.date).getTime());
      consulting[index] = payload;
      const client = { ...this.client, consulting };
      this.store.dispatch(new PatientsAction.updatePatients(client, client.id));
    } else {
      const consult = [ ...this.client?.consulting || [], payload];
      const client = { ...this.client, consulting: consult };
      this.store.dispatch(new PatientsAction.updatePatients(client, client.id));
    }
  }

  resetDetails() {
    this.consultingForm.reset();
  }

  openEditModal(item: any, payload: any) {
    this.isEditModal = false;
    this.resetDetails();
    this.modalService.open(item, { ariaLabelledBy: "modal-basic-title" });
    this.consultingForm.patchValue(payload);
    this.isEditModal = true;
  }

  deleteRecord(payload: any, client: any) {
    const consulting = client?.consulting || [];
    const index = consulting?.findIndex((i: any) => new Date(payload.date).getTime() == new Date(i.date).getTime())
    consulting.splice(index, 1);
    client.consulting = consulting;
    this.store.dispatch(new PatientsAction.updatePatients(client, client.id));
  }
}
