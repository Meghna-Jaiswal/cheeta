// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiURL: "https://dev.apis.mogiio.com/",
  cheetaUserURL: "https://dev.apis.mogiio.com/cheeta-users/",
  ticketUrl: "https://dev.apis.mogiio.com/cheeta-ticket/",
  // ticketUrl: "http://localhost:3071/cheeta-ticket/",

  tagsUrl: "https://dev.apis.mogiio.com/cheeta-tags/",
  okrUrl: "https://dev.apis.mogiio.com/cheeta-okr/",


  roleTypeArray: [
    'tech-trainee',
    'qa-trainee',
    'marketing/sales',
    'software-developer',
    'management',
    'quality-analyst',
    'client-qa',
    'team-leader',
    'project-manager',
    'ceo',
    'cto',
    'devOps'
  ],

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
