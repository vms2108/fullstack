import { OrderPositionJson } from './../shared/interfaces/order-position.json-interface';
import { Injectable } from '@angular/core';
import { PositionJson } from '../shared/interfaces/position.json-interface';

@Injectable()
export class OrderService {

  public list: OrderPositionJson[] = [];

  public price = 0;

  public add(position: PositionJson): void {
    const orderPosition: OrderPositionJson = Object.assign({}, {
      name: position.name,
      cost: position.cost,
      quantity: position.quantity,
      _id: position._id,
    });

    const candidate = this.list.find(p => p._id === orderPosition._id);

    if (candidate) {
      candidate.quantity += orderPosition.quantity;
    } else {
      this.list.push(orderPosition);
    }

    this.computePrice();
  }

  public remove(orderPosition: OrderPositionJson): void {
    this.list.filter(item => item._id !== orderPosition._id);
    this.computePrice();
  }

  public clear(): void {
    this.list = [];
    this.price = 0;
  }

  private computePrice(): void {
    this.price = this.list.reduce((total, item) => {
      return total += item.quantity * item.cost;
    }, 0);
  }
}
