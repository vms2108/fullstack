import { MaterialService } from './../shared/classes/material.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit, OnDestroy {

  public form!: FormGroup;

  private destroy = new Subject<void>();

  constructor(
    private readonly auth: AuthService,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) { }

  public ngOnInit(): void {
    this.createForm();
    this.route.queryParams
      .subscribe((params) => {
        if (params.registered) {
          MaterialService.toast('Можете зайти в систему, используя свои данные');
        } else if (params.accessDenied) {
          MaterialService.toast('Авторизуйтесь');
        } else if (params.sessionFailed) {
          MaterialService.toast('Пожалуйста, войдите в систему заново');
        }
      });
  }

  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  public onSubmit(): void {
    this.form.disable();
    const user = this.form.value;

    this.auth.login(user)
      .pipe(
        takeUntil(this.destroy)
      )
      .subscribe(
        () => {
          this.router.navigate(['/overview']);
        },
        (error) => {
          MaterialService.toast(error.error.message);
          this.form.enable();
        }
      );
  }

  private createForm(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

}
