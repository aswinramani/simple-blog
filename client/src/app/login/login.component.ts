import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {}

  login() {
    const clientId = 'my-client-id';
    const redirectUri = 'redirectUri';
    const responseType = 'code';
    const scope = 'openid email profile';
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=${responseType}&scope=${encodeURIComponent(scope)}&prompt=consent`;
    window.location.href = authUrl;
  }

  facebookLogin(): void {
    const facebookClientId = 'app-id';
    const redirectUri = 'redirectUri';
    const responseType = 'code';
    const scope = 'email public_profile';
    const facebookAuthUrl = `https://www.facebook.com/v13.0/dialog/oauth?client_id=${facebookClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=${responseType}&scope=${encodeURIComponent(scope)}`;
    window.location.href = facebookAuthUrl;
  }
}
