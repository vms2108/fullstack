import { FilterJson } from './../shared/interfaces/filter.json-interface';
import { OrderJson } from './../shared/interfaces/order.json-interface';
import { takeUntil, finalize } from 'rxjs/operators';

import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { OrdersService } from '../shared/services/orders.service';
import { Subject } from 'rxjs';

const STEP = 2;

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.scss']
})
export class HistoryPageComponent implements OnInit, OnDestroy {

  public isFilterVisible = false;

  public offset = 0;

  public limit = STEP;

  public orders: OrderJson[] = [];

  public loading = false;

  public reloading = false;

  public noMoreOrders = false;

  private filter: FilterJson = {};

  private destroy = new Subject<void>();

  constructor(
    private readonly ordersService: OrdersService,
    private changeDetectorRef: ChangeDetectorRef,
  ) { }

  public ngOnInit(): void {
    this.setReLoading(true);
    this.fetch();
  }

  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  public loadMore(): void {
    this.offset += STEP;
    this.setLoading(true);
    this.fetch();
  }

  public applyFilter(filter: FilterJson): void {
    this.orders = [];
    this.offset = 0;
    this.setReLoading(true);
    this.filter = filter;
    this.fetch();
  }

  public isFiltered(): boolean {
    return !!Object.keys(this.filter).length;
  }

  private fetch(): void {
    const params = Object.assign({
      offset: this.offset,
      limit: this.limit,
    }, this.filter);
    this.ordersService.fetch(params)
      .pipe(
        takeUntil(this.destroy),
        finalize(() => {
          this.setLoading(false);
          this.setReLoading(false);
        })
      )
      .subscribe(orders => {
        this.orders = this.orders.concat(orders);
        this.noMoreOrders = orders.length < STEP;
      });
  }

  private setLoading(loading: boolean): void {
    this.loading = loading;
    this.changeDetectorRef.markForCheck();
  }

  private setReLoading(loading: boolean): void {
    this.reloading = loading;
    this.changeDetectorRef.markForCheck();
  }

}
