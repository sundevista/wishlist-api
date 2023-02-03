import { Integration } from "src/integration/dto/integration/integration";
export class Wish {
    name: string;
    descriprion: string;
    price: number;
    reserved_by: null| number;
    //integrations: Integration[];
}
