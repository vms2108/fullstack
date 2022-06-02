import { MessageJson } from './../interfaces/message.json-interface';
import { Observable } from 'rxjs';
import { PositionJson } from './../interfaces/position.json-interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PositionsService {
  constructor(
    private readonly http: HttpClient,
  ) {}

  public fetch(id: string): Observable<PositionJson[]> {
    return this.http
      .get<PositionJson[]>(`/api/position/${ id }`);
  }

  public create(position: PositionJson): Observable<PositionJson> {
    return this.http
      .post<PositionJson>('/api/position', position);
  }

  public update(position: PositionJson): Observable<PositionJson> {
    return this.http
      .patch<PositionJson>(`/api/position/${ position._id }`, position);
  }

  public delete(position: PositionJson): Observable<MessageJson> {
    return this.http
      .delete<MessageJson>(`/api/position/${ position._id }`);
  }
}
