import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext, Store } from "@ngxs/store";

import { ClientAction, ClientModel } from "./index";
import { DataStoreService } from "../../global-provider/data-store/data-store.service";
import { DATABASESETTINGS } from "../../global-provider/constant/constant";
import { MessageService } from "primeng/api";

export interface ClientStateModel {
  loader: boolean | false;
  clients: ClientModel | undefined;
  selectedClient: ClientModel | undefined;
  searchedText: string;
}

@State<ClientStateModel>({
  name: "patientsState",
  defaults: {
    loader: false,
    selectedClient: undefined,
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
  ) { }

  @Selector()
  static getClient(state: ClientStateModel) {
    return state.clients;
  }

  @Selector()
  static searchClients(state: ClientStateModel) {
    return state.searchedText;
  }

  @Selector()
  static getSelectedClientData(state: ClientStateModel) {
    return state.selectedClient;
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
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Client Added Successfully' });
      })
      .catch((res: any) => {
        this.messageService.add({ severity: 'error', summary: 'error', detail: 'Failed to add client' });
      });
  }

  @Action(ClientAction.updateClient)
  updateClient(
    { getState, setState, patchState }: StateContext<ClientStateModel>,
    { payload, id, isFromDetails, showPoupup }: ClientAction.updateClient
  ) {
    const state = getState();
    return this.DataStoreService.table(DATABASESETTINGS.CLIENTTABLE)
      .update(id, payload)
      .then((res: any) => {
        if (res === 1) {
          if (isFromDetails) {
            this.store.dispatch(new ClientAction.getSelectedClient(id))
          } else {
            this.store.dispatch(ClientAction.getAllClient);
          }
          if (!showPoupup) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Client Updated Successfully' });
          }
        }
      })
      .catch((res: any) => {
        this.messageService.add({ severity: 'error', summary: 'error', detail: 'Failed to Update Client' });
      });
  }

  @Action(ClientAction.getSelectedClient)
  getSelectedClient(
    { getState, patchState }: StateContext<ClientStateModel>,
    { id }: ClientAction.getSelectedClient
  ) {
    const state = getState();
    return this.DataStoreService.table(DATABASESETTINGS.CLIENTTABLE)
      .filter((value) => value.id == id)
      .toArray()
      .then((data) => {
        if (data.length > 0) {
          patchState({ selectedClient: data[0] })
        }
      })
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
        this.store.dispatch(ClientAction.getAllClient);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Entry Deleted Successfully' });
      })
      .catch((res: any) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Cannot delete Entry' });
      });
  }
}
