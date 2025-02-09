
import { HttpErrorResponse, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";
import { catchError, switchMap, throwError } from "rxjs";
import { PostService } from "../services/post.service";
import { RefreshTokenResponse } from "../interfaces/RefreshTokenResponse";
import { constants, ErrorTypes } from "../shared/constants";

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const authService = inject(AuthService);
  const postService = inject(PostService);
  const authToken = authService.getAuthToken();
  const router = inject(Router); 
  const isPostDetail = postService.inPostDetailPage();
  const isPostState = router.url?.includes('post');
  if (isPostState && !isPostDetail && !req.url.includes('refresh')) {
    const newReq = req.clone({
      setHeaders: {
        Authorization: `${constants.tokenType} ${authToken}`,
      },
    });
    return next(newReq)
    .pipe(
      catchError((httpError: HttpErrorResponse) => {
        if (httpError.status === 401 && httpError.error.message.toLowerCase().includes(ErrorTypes.TOKEN_EXPIRED)) {
          console.error({ tokenExpError: httpError });
          return authService.refreshToken().pipe(
            switchMap((resp: RefreshTokenResponse) => {
              authService.storeTokenByKey(constants.accessToken, resp.accessToken);
              authService.storeTokenByKey(constants.refreshToken, resp.refreshToken);
              const retryReq = req.clone({
                setHeaders: {
                  Authorization: `${constants.tokenType} ${resp.accessToken}`,
                },
              });
              return next(retryReq);
            }),
            catchError((refreshError: HttpErrorResponse) => {
              console.error({ refreshError: refreshError });
              authService.logout();
              return throwError(() => refreshError);
            })
          );
        } else {
          console.error({ unAuthError: httpError });
          authService.logout();
          return throwError(() => httpError);
        }
      })
    );
  }
  return next(req)
  .pipe(
    catchError((error) => {
      console.error('Public interceptError occurred:', error);
      return throwError(() => new Error(error));
    })
  );
};
