import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { provideHttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { AuthInterceptor } from './token.interceptor';
import { AuthService } from '../services/auth.service';
import { PostService } from '../services/post.service';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { constants, ErrorTypes } from '../shared/constants';
import { RefreshTokenResponse } from '../interfaces/RefreshTokenResponse';

describe('AuthInterceptor', () => {
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let postServiceMock: jasmine.SpyObj<PostService>;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getAuthToken', 'refreshToken', 'storeTokenByKey', 'logout']);
    const postServiceSpy = jasmine.createSpyObj('PostService', ['inPostDetailPage']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate'], { url: '/post/123' });

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: PostService, useValue: postServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    authServiceMock = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    postServiceMock = TestBed.inject(PostService) as jasmine.SpyObj<PostService>;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add an Authorization header', () => {
    authServiceMock.getAuthToken.and.returnValue('testToken');
    postServiceMock.inPostDetailPage.and.returnValue(false);

    const httpRequest = new HttpRequest('GET', '/test');
    const httpHandler = {
      handle: (req: HttpRequest<any>) => {
        expect(req.headers.get('Authorization')).toBe(`${constants.tokenType} testToken`);
        return of(null as unknown as HttpEvent<any>);
      }
    };

    const interceptor = TestBed.inject(HTTP_INTERCEPTORS).find(i => i instanceof AuthInterceptor) as AuthInterceptor;
    interceptor.intercept(httpRequest, httpHandler).subscribe();
  });

  it('should handle 401 errors and refresh token', () => {
    authServiceMock.getAuthToken.and.returnValue('testToken');
    postServiceMock.inPostDetailPage.and.returnValue(false);
    authServiceMock.refreshToken.and.returnValue(of({ accessToken: 'newAccessToken', refreshToken: 'newRefreshToken' } as RefreshTokenResponse));

    const httpRequest = new HttpRequest('GET', '/test');
    const httpHandler = {
      handle: (req: HttpRequest<any>) => {
        if (req.headers.get('Authorization') === `${constants.tokenType} testToken`) {
          return throwError(() => new HttpErrorResponse({ status: 401, error: { message: ErrorTypes.TOKEN_EXPIRED } }));
        }
        expect(req.headers.get('Authorization')).toBe(`${constants.tokenType} newAccessToken`);
        return of(null as unknown as HttpEvent<any>);
      }
    };

    const interceptor = TestBed.inject(HTTP_INTERCEPTORS).find(i => i instanceof AuthInterceptor) as AuthInterceptor;
    interceptor.intercept(httpRequest, httpHandler).subscribe();
    expect(authServiceMock.refreshToken).toHaveBeenCalled();
    expect(authServiceMock.storeTokenByKey).toHaveBeenCalledWith(constants.accessToken, 'newAccessToken');
    expect(authServiceMock.storeTokenByKey).toHaveBeenCalledWith(constants.refreshToken, 'newRefreshToken');
  });

  it('should logout on refresh token error', () => {
    authServiceMock.getAuthToken.and.returnValue('testToken');
    postServiceMock.inPostDetailPage.and.returnValue(false);
    authServiceMock.refreshToken.and.returnValue(throwError(() => new HttpErrorResponse({ status: 401 })));

    const httpRequest = new HttpRequest('GET', '/test');
    const httpHandler = {
      handle: (req: HttpRequest<any>) => {
        return throwError(() => new HttpErrorResponse({ status: 401, error: { message: ErrorTypes.TOKEN_EXPIRED } }));
      }
    };

    const interceptor = TestBed.inject(HTTP_INTERCEPTORS).find(i => i instanceof AuthInterceptor) as AuthInterceptor;
    interceptor.intercept(httpRequest, httpHandler).subscribe({
      error: () => {
        expect(authServiceMock.logout).toHaveBeenCalled();
      }
    });
  });

  it('should pass through non-401 errors', () => {
    authServiceMock.getAuthToken.and.returnValue('testToken');
    postServiceMock.inPostDetailPage.and.returnValue(false);

    const httpRequest = new HttpRequest('GET', '/test');
    const httpHandler = {
      handle: (req: HttpRequest<any>) => {
        return throwError(() => new HttpErrorResponse({ status: 500 }));
      }
    };

    const interceptor = TestBed.inject(HTTP_INTERCEPTORS).find(i => i instanceof AuthInterceptor) as AuthInterceptor;
    interceptor.intercept(httpRequest, httpHandler).subscribe({
      error: (error) => {
        expect(error.status).toBe(500);
      }
    });
  });
});
