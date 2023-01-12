import { NgModule } from "@angular/core";
import { NgxsModule } from "@ngxs/store";

import { PatientsState } from "./patients";
import { AutenticationState } from './authorization'

const state = [
    PatientsState,AutenticationState
];
@NgModule({
    imports:[
        NgxsModule.forRoot(state),
    ]
})
export class StoreModule{

}
