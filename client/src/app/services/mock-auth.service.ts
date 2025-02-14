import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { PostService } from './post.service';
import { RefreshTokenResponse } from '../interfaces/RefreshTokenResponse';

@Injectable({
  providedIn: 'root'
})
export class MockAuthService {
  loggedIn = new BehaviorSubject<boolean>(false);

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly postService: PostService
  ) {}

  storeTokenByKey(tokenKey: string, token: string): void {
    if (tokenKey === 'accessToken') {
      this.loggedIn.next(true);
    }
  }

  logout(): void {
    console.log('is this coming mock');
    this.loggedIn.next(false);
  }

  getAuthToken(): string | null {
    return 'mockAuthToken';
  }

  refreshToken(): Observable<RefreshTokenResponse> {
    return of({
      accessToken: 'mockAccessToken',
      refreshToken: 'mockRefreshToken'
    });
  }

  googleLogin(): void {
  }

  facebookLogin(): void {
  }
}
