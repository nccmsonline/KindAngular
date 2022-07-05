// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
//  baseUrl: 'http://kindwebapi.suvidhacloud.com/api',               // kind live
//  baseUrl:'http://kinddemowebapi.suvidhacloud.com/api',               // kind demo
  // baseUrl: 'https://kind.org.in:8081/api'
  baseUrl:'https://localhost:44398',


  // imageUrl:'http://suvidhaapi.suvidhacloud.com/SuvidhaImages',     // Demo Suvidha
  imageUrl:'http://kind.org.in:8093/SuvidhaImages',                   //Kind
};

export const environmentNotification = {
  production: false,
  // baseUrl: 'http://kindwebapi.suvidhacloud.com/api'
  baseUrl:'https://localhost:44398'
  //baseUrl: 'http://kinddemowebapi.suvidhacloud.com/api'
};

/*
 * In development mode, for easier debugging, you can ignore zone related error
 * stack frames such as `zone.run`/`zoneDelegate.invokeTask` by importing the
 * below file. Don't forget to comment it out in production mode
 * because it will have a performance impact when errors are thrown
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
