import { Component, OnInit } from "@angular/core";
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

@Component({
  selector: "app-consulting",
  templateUrl: "./consulting.component.html",
  styleUrls: ["./consulting.component.scss"],
})
export class ConsultingComponent implements OnInit {
  searchedText: string = "";
  sortedList: any = [];
  @Select(PatientsState.getPatients) getAllClient$:
    | Observable<PatientsModel[]>
    | undefined;
  @Select(PatientsState.searchClients) searchClients$:  Observable<String> | undefined;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.store.dispatch(PatientsAction.getAllPatients);
    this.getAllClient$
      ?.pipe(takeUntil(this.destroyed$), distinctUntilChanged())
      .subscribe((data: any) => {
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
    this.getSearchedText();
  }

  getSearchedText() {
    this.searchClients$?.pipe(takeUntil(this.destroyed$), distinctUntilChanged())
    .subscribe((data: any) => {
      this.searchedText = data;
    });
  }

  open(item: any) {
    this.modalService.open(item, { ariaLabelledBy: "modal-basic-title" });
  }

  openDetails(item: any) {
    const details = this.sortedList.find(
      (c: any) => c.id == item.id && c.illness == item.illness
    );
    const queryParams: any = {};
    queryParams.myArray = JSON.stringify(details);
    this.router.navigate([`clients/consulting/${item.id}`], { queryParams });
  }
}
