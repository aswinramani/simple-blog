
import { HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const authToken = inject(AuthService).getAuthToken();
  const router = inject(Router);
  const stateList = router.url.split('/');
  const validUUID = isUUID(stateList[stateList.length-1]);
  const isPostState = router.url?.includes('post');
  if (isPostState && !validUUID) {
    const newReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return next(newReq);
  }
  return next(req);
}

function isUUID(str: string) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}


//     return next.handle(request).pipe(
//       catchError((error: HttpErrorResponse) => {
//         if (error.status === 401 && !request.url.includes('/auth/refresh')) {
//           return this.handle401Error(request, next);
//         } else {
//           return throwError(() => error);
//         }
//       })
//     );
//   }


//   private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
//     if (!this.isRefreshing) {
//       this.isRefreshing = true;
//       this.refreshTokenSubject.next(null);

//       return this.authService.refreshToken().pipe(
//         switchMap((newToken: string) => {
//           this.isRefreshing = false;
//           this.refreshTokenSubject.next(newToken);
//           return next.handle(this.addToken(request, newToken));
//         }),
//         catchError((error) => {
//           this.isRefreshing = false;
//           this.authService.logout();
//           return throwError(() => error);
//         })
//       );
//     } else {
//       return this.refreshTokenSubject.pipe(
//         filter(token => token !== null),
//         take(1),
//         switchMap((token) => next.handle(this.addToken(request, token)))
//       );
//     }
//   }
// }
