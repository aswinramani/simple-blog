import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  constructor(
    private readonly authService: AuthService,
  ) { }

  googleLogin(): void {
    this.authService.googleLogin();
  }

  facebookLogin(): void {
    this.authService.facebookLogin();
  }
}
