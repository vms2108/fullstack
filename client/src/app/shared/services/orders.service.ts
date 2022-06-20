import { OrderJson } from './../interfaces/order.json-interface';
import { MessageJson } from './../interfaces/message.json-interface';
import { Observable } from 'rxjs';
import { PositionJson } from './../interfaces/position.json-interface';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  constructor(
    private readonly http: HttpClient,
  ) {}

  public create(order: OrderJson): Observable<OrderJson> {
    return this.http
      .post<OrderJson>('/api/order', order);
  }

  public fetch(params: any = {}): Observable<OrderJson[]> {
    return this.http
      .get<OrderJson[]>('/api/order', {
        params: new HttpParams({
          fromObject: params,
        })
      });
  }

}
