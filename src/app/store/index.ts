import { NgModule } from "@angular/core";
import { NgxsModule } from "@ngxs/store";

import { ClientState } from "./client";
import { AutenticationState } from './authorization'

const state = [
    ClientState,AutenticationState
];
@NgModule({
    imports:[
        NgxsModule.forRoot(state),
    ]
})
export class StoreModule{

}
