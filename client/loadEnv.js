const fs = require('fs');
const dotenv = require('dotenv');

const environment = process.argv[2] || process.env.appEnv;
const envFile = `.env.${environment}`;

dotenv.config({ path: envFile });

const targetPath = `./src/environments/environment.ts`;
const envConfigFile = `
export const env = {
  name: '${environment}',
  host: '${process.env.host}',
  googleClientId: '${process.env.googleClientId}',
  googleRedirectPath: '${process.env.googleRedirectPath}',
  googleAuthority: '${process.env.googleAuthority}',
  googleAuthUrl: '${process.env.googleAuthUrl}',
  googleScopes: '${process.env.googleScopes}',
  facebookAppId: '${process.env.facebookAppId}',
  facebookRedirectPath: '${process.env.facebookRedirectPath}',
  facebookAuthUrl: '${process.env.facebookAuthUrl}',
  facebookAuthority: '${process.env.facebookAuthority}',
  facebookScopes: '${process.env.facebookScopes}',
  responseType: '${process.env.responseType}',
  state: '${process.env.state}',
};
`;

fs.writeFile(targetPath, envConfigFile, (err) => {
  if (err) {
    console.error(err);
  }
});
