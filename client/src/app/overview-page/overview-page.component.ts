import { Observable } from 'rxjs';
import { AnalyticService } from './../shared/services/analytics.service';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { OverviewJson } from '../shared/interfaces/overview.json-interface';

@Component({
  selector: 'app-overview-page',
  templateUrl: './overview-page.component.html',
  styleUrls: ['./overview-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewPageComponent implements OnInit {
  public data$!: Observable<OverviewJson>;

  public yesterday!: Date;  

  constructor(
    private readonly service: AnalyticService,
  ) {}

  public ngOnInit(): void {
    this.data$ = this.service.getOverview()
    this.yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
  }
}
