import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { CategoriesService } from 'src/app/shared/services/categories.service';
import { CategoryJson } from 'src/app/shared/interfaces/category.json-interface';

@Component({
  selector: 'app-order-categories',
  templateUrl: './order-categories.component.html',
  styleUrls: ['./order-categories.component.scss']
})
export class OrderCategoriesComponent implements OnInit {

  public categories$!: Observable<CategoryJson[]>;

  constructor(
    private readonly categoriesService: CategoriesService,
  ) { }

  public ngOnInit(): void {
    this.fetch();
  }

  public fetch(): void {
    this.categories$ = this.categoriesService.fetch();
  }

}
