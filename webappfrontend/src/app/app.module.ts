import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { appConfig } from './app.config';
import { AuthRedirectComponent } from './auth-redirect/auth-redirect.component';
import { FacebookAuthModule } from './facebook-auth.module';
import { GoogleAuthModule } from './google-auth.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AuthRedirectComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GoogleAuthModule,
    FacebookAuthModule,
  ],
  providers: [
    ...appConfig.providers,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
