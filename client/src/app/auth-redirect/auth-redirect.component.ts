import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenStorageService } from '../token-storage/token-storage.service';

@Component({
  selector: 'app-auth-redirect',
  templateUrl: './auth-redirect.component.html',
  styleUrl: './auth-redirect.component.scss'
})
export class AuthRedirectComponent implements OnInit{
  constructor(private route: ActivatedRoute, private router: Router, private tokenStorage: TokenStorageService,) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        this.tokenStorage.storeToken(token);
        this.router.navigate(['/posts']);
      } else {
        this.router.navigate(['/login']);
      }
    });
  }
}
