import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { PostService } from './post.service';
import { env } from '../../environments/environment';
import { constants } from '../shared/constants';
import { RefreshTokenResponse } from '../interfaces/RefreshTokenResponse';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  template: ''
})
class DummyComponent {}

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let postServiceSpy: jasmine.SpyObj<PostService>;
  let mockWindowGoogleOAuth: { location: { href: string } };
  let mockWindowFBOAuth: { location: { href: string } };
  const expectedGoogleOAuthUrl = `${env.googleAuthUrl}?client_id=${env.googleClientId}&redirect_uri=${encodeURIComponent(env.host + env.googleRedirectPath)}&state=${env.state}&response_type=${env.responseType}&scope=${encodeURIComponent(env.googleScopes)}&prompt=consent`;
  const expectedFBOAuthUrl = `${env.facebookAuthUrl}?client_id=${env.facebookAppId}&redirect_uri=${encodeURIComponent(env.host + env.facebookRedirectPath)}&state=${env.state}&response_type=${env.responseType}&scope=${encodeURIComponent(env.facebookScopes)}`;

  beforeEach(() => {
    mockWindowGoogleOAuth = { location: { href: expectedGoogleOAuthUrl } };
    mockWindowFBOAuth = { location: { href: expectedFBOAuthUrl } };
    const spy = jasmine.createSpyObj('PostService', ['inPostDetailPage']);
    
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        AuthService,
        { provide: PostService, useValue: spy },
        provideRouter([
          { path: 'login', component: DummyComponent }
        ]),
        { provide: 'Window', useValue: mockWindowGoogleOAuth }
      ],
      declarations: [
        DummyComponent
      ]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    postServiceSpy = TestBed.inject(PostService) as jasmine.SpyObj<PostService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store token and update loggedIn status', () => {
    service.storeTokenByKey(constants.accessToken, 'testAccessToken');
    expect(localStorage.getItem(constants.accessToken)).toBe('testAccessToken');
    expect(service.loggedIn.value).toBeTrue();
  });

  it('should logout and navigate to login', () => {
    postServiceSpy.inPostDetailPage.and.returnValue(false);
    service.logout();
    expect(localStorage.getItem(constants.accessToken)).toBeNull();
    expect(localStorage.getItem(constants.refreshToken)).toBeNull();
    expect(service.loggedIn.value).toBeFalse();
  });

  it('should get auth token', () => {
    localStorage.setItem(constants.accessToken, 'testAccessToken');
    expect(service.getAuthToken()).toBe('testAccessToken');
  });

  it('should refresh token', () => {
    const dummyResponse: RefreshTokenResponse = {
      accessToken: 'newAccessToken',
      refreshToken: 'newRefreshToken'
    };
    localStorage.setItem(constants.refreshToken, 'testRefreshToken');

    service.refreshToken().subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${env.host}/auth/refresh`);
    expect(req.request.method).toBe('POST');
    req.flush(dummyResponse);
  });

  it('should navigate to Google OAuth URL', () => {
    spyOn(service, 'navigateToOAuthUrl');
    service.googleLogin();
    const expectedGoogleUrlPattern = new RegExp(`^${env.googleAuthUrl}\\?client_id=${env.googleClientId}&redirect_uri=${encodeURIComponent(env.host + env.googleRedirectPath)}&state=${env.state}&response_type=${env.responseType}&scope=${encodeURIComponent(env.googleScopes)}&prompt=consent`);
    expect(service.navigateToOAuthUrl).toHaveBeenCalledWith(jasmine.stringMatching(expectedGoogleUrlPattern));
    expect(mockWindowGoogleOAuth.location.href).toMatch(expectedGoogleUrlPattern);
  });

  it('should navigate to Facebook OAuth URL', () => {
    spyOn(service, 'navigateToOAuthUrl');
    service.facebookLogin();
    const expectedFBUrlPattern = new RegExp(`^${env.facebookAuthUrl}\\?client_id=${env.facebookAppId}&redirect_uri=${encodeURIComponent(env.host + env.facebookRedirectPath)}&state=${env.state}&response_type=${env.responseType}&scope=${encodeURIComponent(env.facebookScopes)}`);
    expect(service.navigateToOAuthUrl).toHaveBeenCalledWith(jasmine.stringMatching(expectedFBUrlPattern));
    expect(mockWindowFBOAuth.location.href).toMatch(expectedFBUrlPattern);
  });

});
 