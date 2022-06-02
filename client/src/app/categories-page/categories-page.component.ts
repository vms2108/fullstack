import { CategoriesService } from './../shared/services/categories.service';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CategoryJson } from '../shared/interfaces/category.json-interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-categories-page',
  templateUrl: './categories-page.component.html',
  styleUrls: ['./categories-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesPageComponent implements OnInit {

  public categories$!: Observable<CategoryJson[]>;

  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) { }

  public ngOnInit(): void {
    this.fetch();
  }

  public fetch(): void {
    this.categories$ =  this.categoriesService.fetch();
  }

}
