import { finalize, takeUntil } from 'rxjs/operators';
import { OrderJson } from './../shared/interfaces/order.json-interface';
import { OrdersService } from './../shared/services/orders.service';
import { OrderPositionJson } from './../shared/interfaces/order-position.json-interface';
import { OrderService } from './order.service';
import { MaterialInstanse } from './../shared/classes/material.service';
import { NavigationEnd, Router } from '@angular/router';
import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { MaterialService } from '../shared/classes/material.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.scss'],
  providers: [OrderService],
})
export class OrderPageComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('modal')
  public modalRef!: ElementRef;

  public modal!: MaterialInstanse;

  public isRoot!: boolean;

  public loading = false;

  private destroy = new Subject<void>();

  constructor(
    private readonly router: Router,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly ordersService: OrdersService,
    public readonly order: OrderService,
  ) { }

  public ngOnInit(): void {
    this.getIsRoot();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.getIsRoot();
      }
    });
  }

  public ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef);
  }

  public ngOnDestroy(): void {
    this.modal.destroy();
    this.destroy.next();
    this.destroy.complete();
  }

  public open(): void {
    this.modal.open();
  }

  public submit(): void {
    this.setLoading(true);
    const order: OrderJson = {
      list: this.order.list.map(item => {
        delete item._id;
        return item;
      }),
    };
    this.ordersService
      .create(order)
      .pipe(
        finalize(() => {
          this.modal.close();
          this.setLoading(false);
        }),
        takeUntil(this.destroy),
      )
      .subscribe(
        newOrder => {
          MaterialService.toast(`Заказ №${newOrder.order} был добавлен`);
          this.order.clear();
        },
        error => MaterialService.toast(error.error.message),
      );
  }

  public cancel(): void {
    this.modal.close();
  }

  public removePosition(orderPosition: OrderPositionJson): void {
    this.order.remove(orderPosition);
  }

  private getIsRoot(): void {
    this.isRoot = this.router.url === '/category';
    this.changeDetectorRef.markForCheck();
  }

  private setLoading(loading: boolean): void {
    this.loading = loading;
    this.changeDetectorRef.markForCheck();
  }

}
