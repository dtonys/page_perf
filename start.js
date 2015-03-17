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

// search
p.promise = browser
  .init({ browserName: browser_name })
  .setAsyncScriptTimeout(30000)