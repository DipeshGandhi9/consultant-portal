import { JsonApiModelConfig, JsonApiModel, Attribute } from "angular2-jsonapi";

@JsonApiModelConfig({
  type: "user",
})
export class AutneticationModel extends JsonApiModel {
  @Attribute() email: string | undefined
  @Attribute() password: string | undefined;
}
