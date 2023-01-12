import { PatientsModel } from './patients.model';

export namespace PatientsAction {
  export class getAllPatients {
    static readonly type = "[Patients] getAllPatients";
  }

  export class addPatients {
    static readonly type = "[Patients] addPatients";
    constructor(public payload: PatientsModel) {}
  }

  export class updatePatients {
    static readonly type = '[Patients] updatePatients';
    constructor(public payload: PatientsModel, public id: string) {}
  }

  export class getSearchedClients {
    static readonly type = '[Patients] getSearchedClients';
    constructor(public payload: string) {}
  }

  export class deletePatients {
    static readonly type = '[Patients] deletePatients';
    constructor(public id: string) {}
  }
}
