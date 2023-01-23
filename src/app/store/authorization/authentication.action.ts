import { AutneticationModel  } from './autentication.model';

export namespace AutenticationAction {

  export class Login {
    static readonly type = "[Autentication] Login";
    constructor(public payload: AutneticationModel) {}
  }

  export class Logout {
    static readonly type = "[Autentication] Logout";
    constructor() {}
  }

  export class validateLogins {
    static readonly type = "[Autentication] validateLogin";
    constructor() {}
  }

}
