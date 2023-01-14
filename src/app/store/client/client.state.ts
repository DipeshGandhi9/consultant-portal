import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext, Store } from "@ngxs/store";

import { ClientAction, ClientModel } from "./index";
import { DataStoreService } from "../../global-provider/data-store/data-store.service";
import { DATABASESETTINGS } from "../../global-provider/constant/constant";
import { MessageService } from "primeng/api";

export interface ClientStateModel {
  loader: boolean | false;
  clients: ClientModel | undefined;
  searchedText: string;
}

@State<ClientStateModel>({
  name: "patientsState",
  defaults: {
    loader: false,
    clients: undefined,
    searchedText: "",
  },
})
@Injectable()
export class ClientState {
  constructor(
    private store: Store,
    public DataStoreService: DataStoreService,
    private messageService: MessageService
  ) {}

  @Selector()
  static getClient(state: ClientStateModel) {
    return state.clients;
  }

  @Selector()
  static searchClients(state: ClientStateModel) {
    return state.searchedText;
  }

  @Action(ClientAction.getSearchedClients)
  getSearchedClients(
    { getState, setState, patchState }: StateContext<ClientStateModel>,
    { payload }: ClientAction.getSearchedClients
  ) {
    const state = getState();
    return patchState({ ...state, searchedText: payload });
  }

  @Action(ClientAction.getAllClient)
  getAllClient({
    getState,
    setState,
    patchState,
  }: StateContext<ClientStateModel>) {
    const state = getState();

    patchState({ ...state, loader: true });
    return this.DataStoreService.table(DATABASESETTINGS.CLIENTTABLE)
      .toArray()
      .then((res: any) => {
        if (res.length > 0) {
          setState({ ...state, clients: res, loader: false });
        } else {
          setState({ ...state, clients: undefined, loader: false });
        }
      })
      .catch((err: any) => {
        setState({ ...state, clients: undefined, loader: false });
      });
  }

  @Action(ClientAction.addClient)
  addClient(
    { getState, setState, patchState }: StateContext<ClientStateModel>,
    { payload }: ClientAction.addClient
  ) {
    const state = getState();
    patchState({ ...state, loader: true });
    return this.DataStoreService.table(DATABASESETTINGS.CLIENTTABLE)
      .add(payload)
      .then((res: any) => {
        this.store.dispatch(ClientAction.getAllClient);
           this.messageService.add({severity:'success', summary: 'Success', detail: 'Client Added Successfully'});
      })
      .catch((res: any) => {
        console.log("Error : ", res);
        this.messageService.add({severity:'error', summary: 'error', detail: 'Failed to add client'});
      });
  }

  @Action(ClientAction.updateClient)
  updateClient(
    { getState, setState, patchState }: StateContext<ClientStateModel>,
    { payload, id }: ClientAction.updateClient
  ) {
    const state = getState();
    return this.DataStoreService.table(DATABASESETTINGS.CLIENTTABLE)
      .update(id, payload)
      .then((res: any) => {
        if (res === 1) {
          const data: any = state.clients;
          const indexData = data.findIndex((val: any) => val.id === id);
          data[indexData] = payload;
          patchState({ clients: data });
        }
      })
      .catch((res: any) => {
        console.log(res);
      });
  }

  @Action(ClientAction.deleteClient)
  deleteClient(
    { getState, setState, patchState }: StateContext<ClientStateModel>,
    { id }: ClientAction.deleteClient
  ) {
    const state = getState();
    return this.DataStoreService.table(DATABASESETTINGS.CLIENTTABLE)
      .delete(id)
      .then((res: any) => {
        const data: any = state.clients;
        const filterData = data?.filter((val: any) => val.id == !id);
        patchState({ clients: filterData });
        this.messageService.add({severity:'success', summary: 'Success', detail: 'Data Deleted Successfully'});
      })
      .catch((res: any) => {
        this.messageService.add({severity:'success', summary: 'Success', detail: 'Cannot delete iqqty'});
      });
  }
}
