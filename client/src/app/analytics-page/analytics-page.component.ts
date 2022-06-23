import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AnalyticService } from './../shared/services/analytics.service';
import { Chart, ChartConfiguration, registerables  } from 'chart.js'
import { Component, ViewChild, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy, AfterViewInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsPageComponent implements AfterViewInit, OnDestroy {

  @ViewChild('gain')
  public gainRef!: ElementRef;

  @ViewChild('order')
  public orderRef!: ElementRef;

  public average!: number;

  public pending = true;

  private destroy = new Subject<void>();

  constructor(
    private readonly analyticService: AnalyticService,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) { }

  public ngAfterViewInit(): void {
    Chart.register(...registerables);
  
    const gainConfig: any = {
      label: 'Выручка',
      color: 'rgb(255, 99, 132)',
    };

    const orderConfig: any = {
      label: 'Заказы',
      color: 'rgb(99, 255, 132)',
    };
    this.analyticService
      .getAnalytics()
      .pipe(takeUntil(this.destroy))
      .subscribe(data => {
        this.average = data.average;
        this.pending = false;
        gainConfig.labels = data.chart.map(item => item.label)
        gainConfig.data = data.chart.map(item => item.gain)
        const gainCtx = this.gainRef.nativeElement.getContext('2d')
        gainCtx.canvas.height = '300px';
        new Chart(gainCtx, createCharnConfig(gainConfig))

        orderConfig.labels = data.chart.map(item => item.label)
        orderConfig.data = data.chart.map(item => item.order)
        const orderCtx = this.orderRef.nativeElement.getContext('2d')
        orderCtx.canvas.height = '300px';
        new Chart(orderCtx, createCharnConfig(orderConfig))
        this.changeDetectorRef.markForCheck();
      })
  }

  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

}

function createCharnConfig({labels, data, label, color}): ChartConfiguration {
  console.log(data, label)
    return {
      type: 'line',
      options: {
        responsive: true,
      },
      data: {
        labels,
        datasets: [
          {
            label, data,
            borderColor: color,
            stepped: true,
            fill: false,
          }
        ]
      }
    }
}
