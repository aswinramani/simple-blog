import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../services/auth.service';
import { MockAuthService } from '../shared/mock-auth.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useClass: MockAuthService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('should create the login component', () => {
    expect(component).toBeTruthy();
  });

  it('should call authService.googleLogin when googleLogin is called', () => {
    spyOn(authService, 'googleLogin');
    component.googleLogin();
    expect(authService.googleLogin).toHaveBeenCalled();
  });

  it('should call authService.facebookLogin when facebookLogin is called', () => {
    spyOn(authService, 'facebookLogin');
    component.facebookLogin();
    expect(authService.facebookLogin).toHaveBeenCalled();
  });
});