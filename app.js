var wd = require('wd');
var _ = require('lodash');
var request = require('request');
var assert = require('chai').assert;
var config = require('./config');

var argv = exports.argv = require('minimist')(process.argv.slice(2))

/*** Setup Browser Object ***/
// options
var browsers = ['firefox', 'chrome', 'opera', 'safari']
var environments = {
  'local': 'http://localhost:3000',
  'ws': 'http://webservices.healthtap.com',
  'qa2': 'https://qa2.healthtap.com',
  'labs': 'https://labs.healthtap.com',
  'prod': 'https://www.healthtap.com'
};

// defaults
var browser_name = 'chrome';
var environment = 'qa2';

/* parse command line args and set variables */
// -b <browser_name>
if( argv['b'] && browsers.indexOf( argv['b'] ) !== -1 ) browser_name = argv['b'];
// -e <environment>
if( argv['e'] && environments[argv['e']] ) environment =  argv['e'];

wd.configureHttp({
  timeout: 60000,
  retries: 3,
  retryDelay: 100,
  baseUrl: environments[environment]
});

var browser = wd.promiseChainRemote();
var p = { promise: null };

/*** Expose Components to other files ***/
exports.browser = browser;
exports.environment = environment;
exports.p = p;

console.log('<<<<<<<< Test Start >>>>>>>>');
console.log('browser: '+browser_name+', environment: '+ environment);


// p.promise = browser
//   .init({ browserName: browser_name })
//   .setAsyncScriptTimeout(30000)

var u = require('./util.js');

describe('Logged Out Pages', function(){
  this.timeout(4000);

  _.each( config.static_page_urls, function(url, index){
    it(' GET '+url+' => 200', function( done ){
      var path = environments[environment]+url;
      request( path, function(err, response, body){
        assert( response.statusCode === 200, path+' loads successfully' );
        done();
      });
    });
  });

  _.each( config.seo_page_urls, function(url, index){
    it(' GET '+url+' => 200', function( done ){
      var path = environments[environment]+url;
      request( path, function(err, response, body){
        assert( response.statusCode === 200, path+' loads successfully' );
        done();
      });
    });
  });

});

// p.promise = p.promise.get('http://www.google.com');

// p.promise = p.promise
//               .get('/')
//               .then(function(){
//                 return u._url2('/search/diabetes')
//               });
              

// p.promise = u.url('https://qa2.healthtap.com');

// p.promise = p.promise.get('http://www.google.com');

// u.navigate('https://qa2.healthtap.com')

// promise.get('https://www.healthtap.com')

// promise = promise
//   .get('https://qa2.healthtap.com')

// u.login({
//   name: 'member1003@gmail.com',
//   password: 'm3mber'
// })

// browser
//   .get('https://qa2.healthtap.com')
//   .done();

var u = require('./util.js');

// browser.get('https://qa2.healthtap.com');


// browser.get('https://qa2.healthtap.com')


  // .get('https://qa2.healthtap.com')
  // .fin(function(){ return browser.quit(); })
  // .done();

// browser
//   .init({browserName:'chrome'})
//   .get("http://admc.io/wd/test-pages/guinea-pig.html")
//   .title()
//     .should.become('WD Tests')
//   .elementById('i am a link')
//   .click()
//   .eval("window.location.href")
//     .should.eventually.include('guinea-pig2')
//   .back()
//   .elementByCss('#comments').type('Bonjour!')
//   .getValue().should.become('Bonjour!')
//   .fin(function() { return browser.quit(); })
//   .done();