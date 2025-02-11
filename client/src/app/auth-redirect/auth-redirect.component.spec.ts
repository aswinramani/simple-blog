import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AuthRedirectComponent } from './auth-redirect.component';
import { constants } from '../shared/constants';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { MockAuthService } from '../services/mock-auth.service';


describe('AuthRedirectComponent', () => {
  let component: AuthRedirectComponent;
  let fixture: ComponentFixture<AuthRedirectComponent>;
  let authService: AuthService;
  let router: Router;

  const setupTestModule = (queryParams: any) => {
    TestBed.configureTestingModule({
      declarations: [AuthRedirectComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useClass: MockAuthService },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of(queryParams)
          }
        },
        {
          provide: Router,
          useValue: {
            navigate: jasmine.createSpy('navigate')
          }
        }
      ]
    }).compileComponents();
  };

  it('should create the component', () => {
    setupTestModule({ token: 'test-token', refresh: 'test-refresh-token' });
    fixture = TestBed.createComponent(AuthRedirectComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should store tokens and navigate to /posts if tokens are present', () => {
    setupTestModule({ token: 'test-token', refresh: 'test-refresh-token' });
    fixture = TestBed.createComponent(AuthRedirectComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();

    spyOn(authService, 'storeTokenByKey');
    component.ngOnInit();
    expect(authService.storeTokenByKey).toHaveBeenCalledWith(constants.refreshToken, 'test-refresh-token');
    expect(authService.storeTokenByKey).toHaveBeenCalledWith(constants.accessToken, 'test-token');
    expect(router.navigate).toHaveBeenCalledWith(['/posts']);
  });

  it('should navigate to /login if no token is present', () => {
    setupTestModule({ refresh: 'test-refresh-token' });
    fixture = TestBed.createComponent(AuthRedirectComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();

    spyOn(authService, 'storeTokenByKey');
    component.ngOnInit();
    expect(authService.storeTokenByKey).toHaveBeenCalledWith(constants.refreshToken, 'test-refresh-token');
    expect(authService.storeTokenByKey).not.toHaveBeenCalledWith(constants.accessToken, 'test-token');
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should complete destroy$ on ngOnDestroy', () => {
    setupTestModule({ token: 'test-token', refresh: 'test-refresh-token' });
    fixture = TestBed.createComponent(AuthRedirectComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();

    spyOn(component['destroy$'], 'next');
    spyOn(component['destroy$'], 'complete');
    component.ngOnDestroy();
    expect(component['destroy$'].next).toHaveBeenCalled();
    expect(component['destroy$'].complete).toHaveBeenCalled();
  });
});
