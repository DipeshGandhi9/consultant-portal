import { JsonApiModelConfig, JsonApiModel, Attribute } from "angular2-jsonapi";

@JsonApiModelConfig({
  type: "clients",
})
export class ClientModel extends JsonApiModel {
  @Attribute() _id: string | undefined;
  @Attribute() name: string | undefined
  @Attribute() date_of_birth: string | undefined;
  @Attribute() birth_time: string | undefined;
  @Attribute() birth_place: string | undefined;
  @Attribute() phone_number: number | undefined;
  @Attribute() address: string | undefined;
  @Attribute() city: string | undefined;
  @Attribute() state: string | undefined;
  @Attribute() country: string | undefined;
  @Attribute() email: boolean | undefined;
}
