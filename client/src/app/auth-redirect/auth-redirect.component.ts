import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { constants } from '../shared/constants';

@Component({
  selector: 'app-auth-redirect',
  templateUrl: './auth-redirect.component.html',
  styleUrl: './auth-redirect.component.scss'
})
export class AuthRedirectComponent implements OnInit{
  private destroy$ = new Subject<void>();
  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly authService: AuthService
  ) {}

  initSubscriptions(): void {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params: Params) => {
      const token = params['token'];
      const refreshToken = params['refresh'];
      if (refreshToken) {
        this.authService.storeTokenByKey(constants.refreshToken, refreshToken);
      }
      if (token) {
        this.authService.storeTokenByKey(constants.accessToken, token);
        this.router.navigate(['/posts']);
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  ngOnInit(): void {
    this.initSubscriptions();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
