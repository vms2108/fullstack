import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MaterialService, MaterialInstanse } from './../../../shared/classes/material.service';
import { PositionJson } from './../../../shared/interfaces/position.json-interface';
import { finalize, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { PositionsService } from './../../../shared/services/positions.service';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnInit,
} from '@angular/core';

@Component({
  selector: 'app-positions-form',
  templateUrl: './positions-form.component.html',
  styleUrls: ['./positions-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PositionsFormComponent implements OnChanges, OnDestroy, AfterViewInit, OnInit {

  @Input()
  public categoryId!: string;

  @ViewChild('modal')
  public modalRef!: ElementRef;

  public form!: FormGroup;

  public positions: PositionJson[] = [];

  public loading = false;

  public positionId = null;

  private modal!: MaterialInstanse;

  private destroy = new Subject<void>();

  constructor(
    private readonly positionsService: PositionsService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly formBuilder: FormBuilder,
  ) { }

  public ngOnChanges(): void {
    this.fetch();
  }

  public ngOnInit(): void {
    this.createForm();
  }

  public ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef);
  }

  public ngOnDestroy(): void {
    this.modal.destroy();
    this.destroy.next();
    this.destroy.complete();
  }

  public onSelectPosition(position: PositionJson | null): void {
    if (position) {
      this.form.patchValue({ name: position.name, cost: position.cost });
      this.positionId = position._id;
    } else {
      this.form.patchValue({ name: '', cost: 1 });
      this.positionId = null;
    }

    MaterialService.updateTextInputs();
    this.modal.open();
    this.changeDetectorRef.markForCheck();
  }

  public onDeletePosition(event: Event, position: PositionJson): void {
    event.stopPropagation();
    const desition = window.confirm(`Удалить позицию ${ position.name }?`);

    if (desition) {
      this.positionsService
        .delete(position)
        .pipe(takeUntil(this.destroy))
        .subscribe(
          (answer) => {
            MaterialService.toast(answer.message);
            this.positions = this.positions.filter(item => item._id !== position._id);
            this.changeDetectorRef.markForCheck();
          },
          (error) => MaterialService.toast(error.error.message),
        );
    }
  }

  public onSubmit(): void {
    this.form.disable();
    if (this.positionId) {
      this.updatePosition();
    } else {
      this.createPosition();
    }
  }

  private createPosition(): void {
    const newPos: PositionJson = {
      name: this.form.value.name,
      cost: this.form.value.cost,
      category: this.categoryId,
    };

    this.positionsService
      .create(newPos)
      .pipe(
        finalize(() => {
          this.form.reset({ name: '', cost: null});
          this.form.enable();
          this.onCancel();
          this.changeDetectorRef.markForCheck();
        }),
      )
      .subscribe(
        position => {
          MaterialService.toast('Позиция создана'),
          this.positions.push(position);
          this.changeDetectorRef.markForCheck();
        },
        error => MaterialService.toast(error.error.message),
      );
  }

  private updatePosition(): void {
    const newPos: PositionJson = {
      name: this.form.value.name,
      cost: this.form.value.cost,
      category: this.categoryId,
      _id: this.positionId,
    };

    this.positionsService
      .update(newPos)
      .pipe(
        finalize(() => {
          this.form.reset({ name: '', cost: null});
          this.form.enable();
          this.onCancel();
          this.changeDetectorRef.markForCheck();
        }),
      )
      .subscribe(
        position => {
          MaterialService.toast('Позиция изменена'),
          this.positions = this.positions.map(item => item._id === position._id ? position : item);
          this.changeDetectorRef.markForCheck();
        },
        error => MaterialService.toast(error.error.message),
      );
  }


  public onCancel(): void {
    this.modal.close();
  }

  private fetch(): void {
    this.setLoading(true);
    this.positionsService
      .fetch(this.categoryId)
      .pipe(
        takeUntil(this.destroy),
        finalize(() => this.setLoading(false)),
      )
      .subscribe(positions => {
        this.positions = positions;
        this.changeDetectorRef.markForCheck();
      });
  }

  private createForm(): void {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      cost: [1, [Validators.required, Validators.min(1)]],
    });
  }

  private setLoading(loading: boolean): void {
    this.loading = loading;
    this.changeDetectorRef.markForCheck();
  }

}
