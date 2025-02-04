import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthRedirectComponent } from './auth-redirect/auth-redirect.component';
import { AuthGuard } from './auth-redirect/auth.guard';
import { NewPostComponent } from './new-post/new-post.component';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { PostsComponent } from './posts/posts.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'auth/redirect', component: AuthRedirectComponent },
  { path: 'posts', component: PostsComponent, canActivate: [AuthGuard] },
  { path: 'post/new', component: NewPostComponent, canActivate: [AuthGuard] },
  { path: 'post/:postId', component: PostDetailComponent },
  { path: '', redirectTo: '/posts', pathMatch: 'full' },
  { path: '**', redirectTo: '/posts' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
