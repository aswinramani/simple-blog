import { NgModule } from '@angular/core';
import { AuthModule } from 'angular-auth-oidc-client';
import { facebookConfig } from './oauth.config';

@NgModule({
  imports: [
    AuthModule.forRoot({
      config: facebookConfig,
    }),
  ],
})
export class FacebookAuthModule {}