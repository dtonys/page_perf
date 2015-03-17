var wd = require('wd');
var _ = require('lodash');
var config = require('./config');
var sleep = require('sleep');

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

var page = '/search';

// setup
p.promise = browser
  .init({ browserName: browser_name })
  .setAsyncScriptTimeout(30000)

login();

// set the cookie to enable page tracking
p.promise = p.promise.setCookie({ name: 'page_load_object', value: '{}' });

// run targeted pages n times
run_page_n_times("/search", 10);
run_page_n_times("/topics/cancer", 10);
run_page_n_times("/ask_docs", 10);

p.promise = p.promise.eval("docCookies.getItem('page_load_object')", function(err, res){
  console.log(' Results: ');
  console.log( res );
  return p.promise;
  //console.log( JSON.parse(res) );
});

p.promise = p.promise.deleteCookie( 'page_load_object' );

// utility fns
function login(){
  p.promise = p.promise
    .get("/login")
    .elementByCss('.email-input').type('member1003@gmail.com')
    .elementByCss('.password-input').type('m3mber')
    .elementByCss('.submit-form').click()
    .sleep(5000)
}

function run_page_n_times( url, times ){
  for( var i=0; i<times; i++ ){
    p.promise = p.promise
      .get(url)
      .sleep(1000)
      .waitForConditionInBrowser("window.performance.timing.domComplete - window.performance.timing.navigationStart > 0", 20000)
      .eval("window.performance.timing.domComplete - window.performance.timing.navigationStart", function(err, res){
        console.log("url : ", url)
        console.log("window.page_load_ms : ", res)
        return p.promise;
      });
  }
}

// quit
p.promise = p.promise
  .quit()
  .done();