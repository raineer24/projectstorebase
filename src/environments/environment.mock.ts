// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  // API_ENDPOINT: 'http://grocer-api-dev.ap-southeast-2.elasticbeanstalk.com/',
  API_ENDPOINT: 'http://localhost:6001/',
  AppName: 'OMG!',
  FACEBOOK_APP_ID: '1858414594186264',
  FACEBOOK_SRC: '//connect.facebook.net/en_US/sdk.js',
  IMAGE_REPO: 'https://s3-ap-southeast-2.amazonaws.com/grocerymegan62201/grocery/',
  ITEMS_PER_PAGE: 18
};
