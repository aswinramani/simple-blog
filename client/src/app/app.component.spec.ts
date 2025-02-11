import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectorRef } from '@angular/core';
import { AppComponent } from './app.component';
import { AuthService } from './services/auth.service';
import { MockAuthService } from './services/mock-auth.service';
import { PostService } from './services/post.service';
// import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
// import { RouterTestingModule } from '@angular/router/testing';
// import { provideRouter } from '@angula     r/router/testing';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([]),],
      declarations: [AppComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useClass: MockAuthService },
        ChangeDetectorRef,
        PostService
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'simple blog'`, () => {
    expect(component.title).toEqual('simple blog');
  });

  it('should set showLogout to true when loggedIn emits true', () => {
    authService.loggedIn.next(true);
    expect(component.showLogout).toBeTrue();
  });

  it('should set showLogout to false when loggedIn emits false', () => {
    authService.loggedIn.next(false);
    expect(component.showLogout).toBeFalse();
  });

  it('should call authService.logout on logout', () => {
    spyOn(authService, 'logout');
    component.logout();
    expect(authService.logout).toHaveBeenCalled();
  });

  it('should complete destroy$ on ngOnDestroy', () => {
    spyOn(component['destroy$'], 'next');
    spyOn(component['destroy$'], 'complete');
    component.ngOnDestroy();
    expect(component['destroy$'].next).toHaveBeenCalled();
    expect(component['destroy$'].complete).toHaveBeenCalled();
  });
});