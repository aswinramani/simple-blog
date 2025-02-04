import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { appConfig } from './app.config';
import { AuthRedirectComponent } from './auth-redirect/auth-redirect.component';
import { FacebookAuthModule } from './facebook-auth.module';
import { GoogleAuthModule } from './google-auth.module';
import { PostsComponent } from './posts/posts.component';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { NewPostComponent } from './new-post/new-post.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AuthRedirectComponent,
    PostsComponent,
    PostDetailComponent,
    NewPostComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GoogleAuthModule,
    FacebookAuthModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    ...appConfig.providers,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
