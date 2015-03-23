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

var page_urls = [
  '/search'
  ,'/topics/cancer'
  ,'/ask_docs'
  ,'/user_questions/14082' // question page with lots of data
  ,'/user_questions/594727' // question page with less data
  ,'/experts/10000090'
  ,'/'
]

// setup
p.promise = browser
  .init({ browserName: browser_name })
  .setAsyncScriptTimeout(30000)

login();

var page_times = {};
// run_page_n_times( '/', 10 )

// run targeted page_urls n times
for( var i in page_urls ){
  var url = page_urls[i];
  run_page_n_times( url, 10 );
}

p.promise = p.promise.eval("docCookies.getItem('page_load_object')", function(err, res){
  console.log(' Results: ');
  console.log( res );
  printTimes();
  return p.promise;
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
  page_times[url] = { times: [], average: null };
  for( var i=0; i<times; i++ ){
    p.promise = p.promise
      .get(url)
      .sleep(1000)
      .waitForConditionInBrowser("window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart > 0", 20000)
      .eval("window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart", function(err, res){
        console.log("url : ", url)
        console.log("window.page_load_ms : ", res)
        page_times[url].times.push( res );
        return p.promise;
      });
  }
}

// when done, get averages & print times
function printTimes(){
  console.log( console.log(new Date()) );
  // get averages
  console.log( page_times )
  for( var url in page_times ){
    console.log( url + ' average: ' + getAverage( page_times[url].times ) )
  }
}

// 
function getAverage( arr, removeNum ){
  var removeNum = removeNum || 1;
  var sum = 0;
  var avg;
  
  // remove top and bottom 2 scores from avg
  arr.sort( function(a,b){ return a -b  }  )
  arr.slice( removeNum )
  arr = arr.slice(0, arr.length-removeNum);
  for( var i = 0; i < arr.length; i++ ){
    sum += arr[i];  
  }
  avg = Math.floor( sum / arr.length );
  return avg;
}

// quit
p.promise = p.promise
  .quit()
  .done();