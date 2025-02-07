import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { PostService } from './post.service';
import { env } from '../../environments/environment';
import { RefreshTokenResponse } from '../interfaces/RefreshTokenResponse';
import { constants } from '../shared/constants';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loggedIn = new BehaviorSubject<boolean>(false);

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly postService: PostService
  ) {
    this.loggedIn.next(Boolean(localStorage.getItem(constants.accessToken)));
  }

  storeTokenByKey(tokenKey: string, token: string): void {
    localStorage.setItem(tokenKey, token);
    if (tokenKey === constants.accessToken) {
      this.loggedIn.next(Boolean(localStorage.getItem(constants.accessToken)));
    }
  }

  logout(): void {
    localStorage.removeItem(constants.accessToken);
    localStorage.removeItem(constants.refreshToken);
    this.loggedIn.next(false);
    const postDetailPage = this.postService.inPostDetailPage();
    if (!postDetailPage) {
      this.router.navigate(['/login']);
    }
  }

  getAuthToken(): string | null {
    return localStorage.getItem(constants.accessToken);
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem(constants.refreshToken);
  }

  refreshToken(): Observable<RefreshTokenResponse> {
    return this.http.post<RefreshTokenResponse>(`${env.apiUrl}/auth/refresh`, {refreshToken: this.getRefreshToken()});
  }

  googleLogin(): void {
    const clientId = env.googleClientId;
    const redirectUri = env.googleRedirectUri;
    const googleAuthUrl = env.googleAuthUrl;
    const responseType = 'code';
    const scope = 'openid email profile';
    const authUrl = `${googleAuthUrl}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=${responseType}&scope=${encodeURIComponent(scope)}&prompt=consent`;
    window.location.href = authUrl;
  }

  facebookLogin(): void {
    const facebookAppId = env.facebookAppId;
    const redirectUri = env.facebookRedirectUri;
    const facebookAuthUrl = env.facebookAuthUrl;
    const responseType = 'code';
    const scope = 'email public_profile';
    const authUrl = `${facebookAuthUrl}?client_id=${facebookAppId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=${responseType}&scope=${encodeURIComponent(scope)}`;
    window.location.href = authUrl;
  }

}
