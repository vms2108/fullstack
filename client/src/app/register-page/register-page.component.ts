import { Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit, OnDestroy {

  public form!: FormGroup;

  private destroy = new Subject<void>();

  constructor(
    private readonly auth: AuthService,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
  ) { }

  public ngOnInit(): void {
    this.createForm();
  }

  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  public onSubmit(): void {
    this.form.disable();
    const user = this.form.value;
  
    this.auth.register(user)
      .pipe(
        takeUntil(this.destroy)
      )
      .subscribe(
        () => {
          this.router.navigate(['/login'], {queryParams: {
            registered: true,
          }});
        },
        (error) => {
          console.warn(error);
          this.form.enable();
        }
      )
  }

  private createForm(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })
  }


}
