const fs = require('fs');
const dotenv = require('dotenv');

const environment = process.argv[2] || process.env.appEnv;
const envFile = `.env.${environment}`;

dotenv.config({ path: envFile });

const targetPath = `./src/environments/environment.ts`;
const envConfigFile = `
export const env = {
  name: '${environment}',
  apiUrl: '${process.env.apiUrl}',
  googleClientId: '${process.env.googleClientId}',
  facebookAppId: '${process.env.facebookAppId}',
  googleRedirectUri: '${process.env.googleRedirectUri}',
  facebookRedirectUri: '${process.env.facebookRedirectUri}',
  redirectUri: '${process.env.redirectUri}',
  googleAuthUrl: '${process.env.googleAuthUrl}',
  facebookAuthUrl: '${process.env.facebookAuthUrl}',
  googleAuthority: '${process.env.googleAuthority}',
  facebookAuthority: '${process.env.facebookAuthority}'
};
`;

fs.writeFile(targetPath, envConfigFile, (err) => {
  if (err) {
    console.error(err);
  }
});
