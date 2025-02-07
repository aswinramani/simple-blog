import { ChangeDetectorRef, Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'simple blog';
  showLogout: boolean = false;
  private destroy$ = new Subject<void>();
  constructor(
    private readonly authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  initSubscribers(): void {
    this.authService.loggedIn.pipe(takeUntil(this.destroy$)).subscribe(value =>{
      this.showLogout = value;
      this.cdr.detectChanges();
    })
  }

  ngOnInit(): void {
    this.initSubscribers();
  }

  logout(): void {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
