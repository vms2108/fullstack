import { MaterialDatepickerJson } from './../../shared/interfaces/material-datepicker.json-inteface';
import { MaterialService } from './../../shared/classes/material.service';
import { FilterJson } from './../../shared/interfaces/filter.json-interface';
import { Component, EventEmitter, Output, ViewChild, ElementRef, OnDestroy, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-history-filter',
  templateUrl: './history-filter.component.html',
  styleUrls: ['./history-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryFilterComponent implements OnDestroy, AfterViewInit {

  @Output()
  public filterReady = new EventEmitter<FilterJson>();

  @ViewChild('start')
  public startRef!: ElementRef;

  @ViewChild('end')
  public endRef!: ElementRef;

  public order!: number;

  public start!: MaterialDatepickerJson;

  public end!: MaterialDatepickerJson;

  public isValid = true;

  constructor(
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {}

  public ngAfterViewInit(): void {
    this.start = MaterialService.initDatepicker(this.startRef, this.validate.bind(this));
    this.end = MaterialService.initDatepicker(this.endRef, this.validate.bind(this));
  }

  public ngOnDestroy(): void {
    this.start.destroy();
    this.end.destroy();
  }

  public submitFilter(): void {
    const filter: FilterJson = {};

    if (this.order) {
      filter.order = this.order;
    }

    if (this.start.date) {
      filter.start = this.start.date;
    }

    if (this.end.date) {
      filter.end = this.end.date;
    }

    this.filterReady.emit(filter);
  }

  private validate(): void {
    if (!this.start.date || !this.end.date) {
      this.isValid = true;
      this.changeDetectorRef.markForCheck();
      return;
    }

    this.isValid = this.start.date < this.end.date;
    this.changeDetectorRef.markForCheck();
  }
}
