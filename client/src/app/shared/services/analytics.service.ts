import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OverviewJson } from '../interfaces/overview.json-interface';

@Injectable({
  providedIn: 'root',
})
export class AnalyticService {
  constructor(
    private http: HttpClient,
  ) {}

  public getOverview(): Observable<OverviewJson> {
    return this.http.get<OverviewJson>('api/analytics/overview')
  }

  public getAnalytics() {}
}
