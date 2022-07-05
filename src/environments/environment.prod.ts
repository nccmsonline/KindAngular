export const environment = {
  production: true,
  baseUrl: 'http://kindwebapi.suvidhacloud.com/api',               // kind live
  // baseUrl:'http://kinddemowebapi.suvidhacloud.com/api',               // kind demo
  // baseUrl: 'https://kind.org.in:8081/api'


  // imageUrl:'http://suvidhaapi.suvidhacloud.com/SuvidhaImages',     // Demo Suvidha
  imageUrl:'http://kind.org.in:8093/SuvidhaImages',                   //Kind
};

export const environmentNotification = {
  production: true,
  baseUrl: 'http://kindwebapi.suvidhacloud.com/api'
  // baseUrl:'https://localhost:44398'
};


// node --max_old_space_size=8192 ./node_modules/@angular/cli/bin/ng build --prod --base-href /suvidha/