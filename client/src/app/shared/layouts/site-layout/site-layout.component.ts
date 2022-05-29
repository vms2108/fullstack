import { MaterialService } from './../../classes/material.service';
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-site-layout',
  templateUrl: './site-layout.component.html',
  styleUrls: ['./site-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteLayoutComponent implements AfterViewInit {

  public links = [
    {
      url: '/overview',
      name: 'Обзор',
    },
    {
      url: '/analytics',
      name: 'Аналитика',
    },
    {
      url: '/history',
      name: 'История',
    },
    {
      url: '/order',
      name: 'Добавить заказ',
    },
    {
      url: '/category',
      name: 'Ассортимент',
    },
  ];

  @ViewChild('floating', {static: true})
  public floatingRef!: ElementRef;

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router,
  ) { }

  public ngAfterViewInit(): void {
    MaterialService.initializeFloatingButton(this.floatingRef);
  }

  public logout(event: Event): void {
    event.preventDefault();
    this.auth.logout();
    this.router.navigate(['/login']);
  }

}
