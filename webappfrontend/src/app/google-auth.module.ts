import { NgModule } from '@angular/core';
import { AuthModule} from 'angular-auth-oidc-client';
import { googleConfig } from './oauth.config';

@NgModule({
  imports: [
    AuthModule.forRoot({
      config: googleConfig,
    }),
  ],
})
export class GoogleAuthModule {}
