import { ClientModel } from './client.model';

export namespace ClientAction {
  export class getAllClient {
    static readonly type = "[Client] getAllClient";
  }

  export class addClient {
    static readonly type = "[Client] addClient";
    constructor(public payload: ClientModel) {}
  }

  export class updateClient {
    static readonly type = '[Client] updateClient';
    constructor(public payload: ClientModel, public id: string, public isFromDetails:boolean) {}
  }

  export class getSearchedClients {
    static readonly type = '[Client] getSearchedClients';
    constructor(public payload: string) {}
  }

  export class deleteClient {
    static readonly type = '[Client] deleteClient';
    constructor(public id: string) {}
  }

  export class getSelectedClient {
    static readonly type = '[Client] getSelectedClient';
    constructor(public id: string) {}
  }
}
