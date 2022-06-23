import { MaterialInstanse, MaterialService } from './../../shared/classes/material.service';
import { OrderJson } from './../../shared/interfaces/order.json-interface';
import { ChangeDetectionStrategy, Component, Input, ViewChild, ElementRef, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryListComponent implements OnDestroy, AfterViewInit {

  @Input()
  public orders: OrderJson[] = [];

  @ViewChild('modal')
  public modalRef!: ElementRef;

  public modal: MaterialInstanse;

  public selectedOrder!: OrderJson;

  constructor(
    private readonly changeDetectionRef: ChangeDetectorRef,
  ) { }

  public ngOnDestroy(): void {
    if (this.modal) {
      this.modal.destroy();
    }
  }

  public ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef);
  }

  public computePrice(order: OrderJson): number {
    return order.list.reduce((total, item) => {
      return total += item.quantity * item.cost;
    }, 0);
  }

  public selectOrder(order: OrderJson): void {
    this.selectedOrder = order;
    this.modal.open();
    this.changeDetectionRef.markForCheck();
  }

  public closeModal(): void {
    this.modal.close();
  }

}
