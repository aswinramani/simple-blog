import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth-redirect',
  templateUrl: './auth-redirect.component.html',
  styleUrl: './auth-redirect.component.scss'
})
export class AuthRedirectComponent implements OnInit{
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      const refreshToken = params['refresh'];
      if (refreshToken) {
        this.authService.storeTokenByKey('refreshToken', refreshToken);
      }
      if (token) {
        this.authService.storeTokenByKey('accessToken', token);
        this.router.navigate(['/posts']);
      } else {
        this.router.navigate(['/login']);
      }
    });
  }
}
