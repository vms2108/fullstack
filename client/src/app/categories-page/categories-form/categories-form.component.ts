import { CategoryJson } from './../../shared/interfaces/category.json-interface';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { CategoriesService } from 'src/app/shared/services/categories.service';
import { switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { MaterialService } from 'src/app/shared/classes/material.service';

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.scss']
})
export class CategoriesFormComponent implements OnInit {

  @ViewChild('input')
  public inputRef: ElementRef;

  public isNew = true;

  public form!: FormGroup;

  public image!: File;

  public imagePreview: string | ArrayBuffer = '';

  public category!: CategoryJson;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly formBuilder: FormBuilder,
    private readonly categoriesService: CategoriesService,
  ) { }

  public ngOnInit(): void {
    this.createForm();
    this.form.disable();
    this.setIsNew();
  }

  public onSubmit(): void {
    let observable: Observable<CategoryJson>;
    this.form.disable();

    if (this.isNew) {
      observable = this.categoriesService.create(this.form.value.name, this.image);
    } else {
      observable = this.categoriesService.update(this.category._id, this.form.value.name, this.image);
    }

    observable
      .subscribe(
        category => {
          this.category = category;
          MaterialService.toast('Изменения сохранены');
          this.changeDetectorRef.markForCheck();
        },
        error => {
          this.form.enable();
          MaterialService.toast(error.error.message);
          this.changeDetectorRef.markForCheck();
        }
      );
  }

  public triggerClick(): void {
    this.inputRef.nativeElement.click();
  }

  public onFileUpload(event: any): void {
    const file = event.target.files[0];
    this.image = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
      this.changeDetectorRef.markForCheck();
    };

    reader.readAsDataURL(file);
    this.changeDetectorRef.markForCheck();
  }

  private setIsNew(): void {
    this.route.params
      .pipe(
        switchMap((params: Params) => {
          if (params.id) {
            this.isNew = false;
            return this.getCategory(params.id);
          } else {
            return of(null);
          }
        })
      )
      .subscribe(
        (category: CategoryJson) => {
          if (category) {
            this.form.patchValue({
              name: category.name,
            });
            this.category = category;
            this.imagePreview = category.imageSrc;
            MaterialService.updateTextInputs();
            this.changeDetectorRef.markForCheck();
          }
          this.form.enable();
        },
        (error) => MaterialService.toast(error.error ? error.error.message : error),
      );
  }

  private createForm(): void {
    this.form = this.formBuilder.group({
      name: [null, Validators.required]
    });
  }

  private getCategory(id: string): Observable<CategoryJson> {
    return this.categoriesService
      .getById(id);
  }

}
