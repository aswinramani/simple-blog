import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthRedirectComponent } from './auth-redirect/auth-redirect.component';
import { AuthGuard } from './auth-redirect/auth.guard';
import { NewPostComponent } from './new-post/new-post.component';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { PostsComponent } from './posts/posts.component';
import { APP_ROUTES } from './shared/constants';

const routes: Routes = [
  { path: APP_ROUTES.LOGIN, component: LoginComponent },
  { path: APP_ROUTES.AUTH_REDIRECT, component: AuthRedirectComponent },
  { path: APP_ROUTES.POSTS, component: PostsComponent, canActivate: [AuthGuard] },
  { path: APP_ROUTES.NEW_POSTS, component: NewPostComponent, canActivate: [AuthGuard] },
  { path: APP_ROUTES.POST_ID, component: PostDetailComponent },
  { path: '', redirectTo: APP_ROUTES.REDIRECT, pathMatch: 'full' },
  { path: '**', redirectTo: APP_ROUTES.REDIRECT }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
