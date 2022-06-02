import { MessageJson } from './../interfaces/message.json-interface';
import { Observable } from 'rxjs';
import { CategoryJson } from './../interfaces/category.json-interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  constructor(
    private readonly http: HttpClient,
  ) {}

  public fetch(): Observable<CategoryJson[]> {
    return this.http
      .get<CategoryJson[]>('/api/category');
  }

  public getById(id: string): Observable<CategoryJson> {
    return this.http
      .get<CategoryJson>(`/api/category/${ id }`);
  }

  public create(name: string, image?: File): Observable<CategoryJson> {
    const formData = new FormData();
    if (image) {
      formData.append('image', image, image.name);
    }

    formData.append('name', name);
    return this.http
      .post<CategoryJson>('/api/category', formData);
  }

  public update(id: string, name: string, image?: File): Observable<CategoryJson> {
    const formData = new FormData();
    if (image) {
      formData.append('image', image, image.name);
    }

    formData.append('name', name);
    return this.http
      .patch<CategoryJson>(`/api/category/${ id }`, formData);
  }

  public delete(id: string): Observable<MessageJson> {
    return this.http
      .delete<MessageJson>(`/api/category/${ id }`);
  }
}
