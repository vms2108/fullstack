import { OrderPositionJson } from "./order-position.json-interface";

export interface OrderJson {
  date?: Date;
  order?: number;
  user?: string;
  list: OrderPositionJson[];
  _id?: string;
}
