import { OrderService } from '../order.service';
import { switchMap, map } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { PositionJson } from 'src/app/shared/interfaces/position.json-interface';
import { PositionsService } from 'src/app/shared/services/positions.service';
import { MaterialService } from 'src/app/shared/classes/material.service';

@Component({
  selector: 'app-order-positions',
  templateUrl: './order-positions.component.html',
  styleUrls: ['./order-positions.component.scss']
})
export class OrderPositionsComponent implements OnInit {

  positions$!: Observable<PositionJson[]>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly positionsService: PositionsService,
    private readonly orderService: OrderService,
  ) { }

  public ngOnInit(): void {
    this.positions$ = this.route.params
      .pipe(
        switchMap(
          (params) => {
            if (params && params.id) {
              return this.positionsService
              .fetch(params.id);
            }
            return of([]);
          }
        ),
        map(positions => positions.map(item => {
          item.quantity = 1;
          return item;
        })),
      );
  }

  public addToOrder(position: PositionJson): void {
    this.orderService
      .add(position);
    MaterialService.toast(`Добавлен х${ position.quantity } ${ position.name }`);
  }

}
