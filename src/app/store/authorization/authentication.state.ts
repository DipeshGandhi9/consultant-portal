import { Injectable, NgZone } from "@angular/core";
import { Action, Selector, State, StateContext, Store } from "@ngxs/store";

import { AutneticationModel } from "./index";
import { AutenticationAction } from "./authentication.action";
import { DataStoreService } from "../../global-provider/data-store/data-store.service";
import { DATABASESETTINGS } from "../../global-provider/constant/constant";
import { MessageService } from "primeng/api";
import { Router } from "@angular/router";

export interface AutenticationStateModel {
  loader: boolean | false;
  userData: AutneticationModel | undefined;
  isLoggedIn: boolean | false;
}

let dummyUser = {
  name:'Ajay Gadia',
  email:'ajay@mail.com',
  password:'password',
}

@State<AutenticationStateModel>({
  name: "Autentication",
  defaults: {
    loader: false,
    userData: undefined,
    isLoggedIn: false,
  },
})
@Injectable()
export class AutenticationState {
  constructor(
    private store: Store,
    private zone:NgZone,
    public DataStoreService: DataStoreService,
    private messageService: MessageService,
    private router:Router
  ) {}

  @Selector()
  static isUserLoggedIn(state: AutenticationStateModel) {
    return state.isLoggedIn;
  }

  @Selector()
  static getLoginLoader(state: AutenticationStateModel) {
    return state.loader;
  }

  @Action(AutenticationAction.Login)
  doLogin(
    { getState, setState, patchState, dispatch }: StateContext<AutenticationStateModel>,
    { payload }: AutenticationAction.Login
  ){
    const state = getState();
    patchState({ ...state, loader: true });
    let user : any = payload.email;
    let password : any = payload.password
    if((user == dummyUser.email) && (password == dummyUser.password)){
      let obj = {
        loader: false ,
        isLoggedIn : true,
        userData : undefined
      };
      localStorage.setItem('isUserAuthenticated',"true")
      patchState({ ...state,  ...obj });
      this.zone.run(()=>{
        this.router.navigateByUrl("/dashboard")
      })
      this.messageService.add({
        severity: "success",
        summary: "Success",
        detail: "Login Successfully.",
      });
    }else{
      let obj = {
        loader: false ,
        isLoggedIn : false,
        userData : undefined
      };
      patchState({ ...state, ...obj  });
      this.messageService.add({
        severity: "error",
        summary: "error",
        detail: "Please check with your credentials.",
      });
    }
  }

  @Action(AutenticationAction.Logout)
  doLogout(
    { getState, setState, patchState, dispatch }: StateContext<AutenticationStateModel>
  ){
    const state = getState();
      patchState({loader:true})
      localStorage.removeItem("isUserAuthenticated")
      this.zone.run(()=>{
        this.router.navigate(['/login']);
      })
  
      patchState({ loader:false, isLoggedIn:false,userData:undefined });
      this.messageService.add({
        severity: "success",
        summary: "Success",
        detail: "Logged out Successfully.",
      });
  }

  @Action(AutenticationAction.validateLogins)
  validateLogin(
    { getState, setState, patchState, dispatch }: StateContext<AutenticationStateModel>
  ){
    const state = getState();
      patchState({loader:true})
      const islogged = localStorage.getItem("isUserAuthenticated");
      if(islogged) {
        setState({...state, isLoggedIn:true});
      }
      
  }

  // @Action(AutenticationAction.Login)
  // getAllPatients(
  //   { getState, setState, patchState }: StateContext<AutenticationStateModel>,
  //   { payload }: AutenticationAction.Login
  // ) {
  //   const state = getState();

  //   patchState({ ...state, loader: true });
  //   let user: any = payload.email;
  //   return this.DataStoreService.table(DATABASESETTINGS.USERTABLE)
  //     .where("email")
  //     .equals(user)
  //     .and(val => val.password === payload.password)
  //     .toArray()
  //     .then((res: any) => {
  //       patchState({ ...state, loader: false });
  //       if (res.length > 0) {
  //         this.messageService.add({
  //           severity: "success",
  //           summary: "Success",
  //           detail: "Login Successfully",
  //         });
  //       } else {
  //         this.messageService.add({
  //           severity: "error",
  //           summary: "error",
  //           detail: "Please check with your entities",
  //         });
  //       }
  //     })
  //     .catch((res:any)=>{
  //       patchState({ ...state, loader: false });
  //       this.messageService.add({
  //         severity: "error",
  //         summary: "error",
  //         detail: "Please check with your entities",
  //       });
  //     });
  // }
}
