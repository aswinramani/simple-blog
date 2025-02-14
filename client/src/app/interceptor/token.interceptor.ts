import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { PostService } from '../services/post.service';
import { RefreshTokenResponse } from '../interfaces/RefreshTokenResponse';
import { constants, ErrorTypes } from '../shared/constants';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private postService: PostService,
    private router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = this.authService.getAuthToken();
    const isPostDetail = this.postService.inPostDetailPage();
    const isPostState = this.router.url?.includes('post');

    if (isPostState && !isPostDetail && !req.url.includes('refresh')) {
      const newReq = req.clone({
        setHeaders: {
          Authorization: `${constants.tokenType} ${authToken}`,
        },
      });

      return next.handle(newReq).pipe(
        catchError((httpError: HttpErrorResponse) => {
          if (httpError.status === 401 && httpError.error.message.toLowerCase().includes(ErrorTypes.TOKEN_EXPIRED)) {
            console.error({ tokenExpError: httpError });

            return this.authService.refreshToken().pipe(
              switchMap((resp: RefreshTokenResponse) => {
                this.authService.storeTokenByKey(constants.accessToken, resp.accessToken);
                this.authService.storeTokenByKey(constants.refreshToken, resp.refreshToken);

                const retryReq = req.clone({
                  setHeaders: {
                    Authorization: `${constants.tokenType} ${resp.accessToken}`,
                  },
                });

                return next.handle(retryReq);
              }),
              catchError((refreshError: HttpErrorResponse) => {
                console.error({ refreshError: refreshError });
                this.authService.logout();
                return throwError(() => refreshError);
              })
            );
          } else {
            console.error({ unAuthError: httpError });
            this.authService.logout();
            return throwError(() => httpError);
          }
        })
      );
    }

    return next.handle(req).pipe(
      catchError((error) => {
        console.error('Public interceptError occurred:', error);
        return throwError(() => new Error(error));
      })
    );
  }
};
