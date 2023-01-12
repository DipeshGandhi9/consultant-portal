import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext, Store } from "@ngxs/store";

import { PatientsAction, PatientsModel } from "./index";
import { DataStoreService } from "../../global-provider/data-store/data-store.service";
import { DATABASESETTINGS } from "../../global-provider/constant/constant";
import { MessageService } from "primeng/api";

export interface PatientStateModel {
  loader: boolean | false;
  patients: PatientsModel | undefined;
  searchedText: string;
}

@State<PatientStateModel>({
  name: "patientsState",
  defaults: {
    loader: false,
    patients: undefined,
    searchedText: "",
  },
})
@Injectable()
export class PatientsState {
  constructor(
    private store: Store,
    public DataStoreService: DataStoreService,
    private messageService: MessageService
  ) {}

  @Selector()
  static getPatients(state: PatientStateModel) {
    return state.patients;
  }

  @Selector()
  static searchClients(state: PatientStateModel) {
    return state.searchedText;
  }

  @Action(PatientsAction.getSearchedClients)
  getSearchedClients(
    { getState, setState, patchState }: StateContext<PatientStateModel>,
    { payload }: PatientsAction.getSearchedClients
  ) {
    const state = getState();
    return patchState({ ...state, searchedText: payload });
  }

  @Action(PatientsAction.getAllPatients)
  getAllPatients({
    getState,
    setState,
    patchState,
  }: StateContext<PatientStateModel>) {
    const state = getState();

    patchState({ ...state, loader: true });
    return this.DataStoreService.table(DATABASESETTINGS.PATIENTTABLE)
      .toArray()
      .then((res: any) => {
        if (res.length > 0) {
          setState({ ...state, patients: res, loader: false });
        } else {
          setState({ ...state, patients: undefined, loader: false });
        }
      })
      .catch((err: any) => {
        setState({ ...state, patients: undefined, loader: false });
      });
  }

  @Action(PatientsAction.addPatients)
  addPatients(
    { getState, setState, patchState }: StateContext<PatientStateModel>,
    { payload }: PatientsAction.addPatients
  ) {
    const state = getState();
    patchState({ ...state, loader: true });
    return this.DataStoreService.table(DATABASESETTINGS.PATIENTTABLE)
      .add(payload)
      .then((res: any) => {
        this.store.dispatch(PatientsAction.getAllPatients);
           this.messageService.add({severity:'success', summary: 'Success', detail: 'Patient Added Successfully'});
      })
      .catch((res: any) => {
        this.messageService.add({severity:'error', summary: 'error', detail: 'Patient Added Successfully'});
      });
  }

  @Action(PatientsAction.updatePatients)
  updatePatients(
    { getState, setState, patchState }: StateContext<PatientStateModel>,
    { payload, id }: PatientsAction.updatePatients
  ) {
    const state = getState();
    return this.DataStoreService.table(DATABASESETTINGS.PATIENTTABLE)
      .update(id, payload)
      .then((res: any) => {
        if (res === 1) {
          const data: any = state.patients;
          const indexData = data.findIndex((val: any) => val.id === id);
          data[indexData] = payload;
          patchState({ patients: data });
        }
      })
      .catch((res: any) => {
        console.log(res);
      });
  }

  @Action(PatientsAction.deletePatients)
  deletePatients(
    { getState, setState, patchState }: StateContext<PatientStateModel>,
    { id }: PatientsAction.deletePatients
  ) {
    const state = getState();
    return this.DataStoreService.table(DATABASESETTINGS.PATIENTTABLE)
      .delete(id)
      .then((res: any) => {
        const data: any = state.patients;
        const filterData = data?.filter((val: any) => val.id == !id);
        patchState({ patients: filterData });
        this.messageService.add({severity:'success', summary: 'Success', detail: 'Data Deleted Successfully'});
      })
      .catch((res: any) => {
        this.messageService.add({severity:'success', summary: 'Success', detail: 'Cannot delete iqqty'});
      });
  }
}
