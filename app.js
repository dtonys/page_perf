var wd = require('wd');
var _ = require('lodash');
var request = require('request');
var assert = require('chai').assert

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

// static pages
var static_page_urls = [
  '/who_we_are/gain_access',

  '/who_we_are',
  '/who_we_are/press',
  '/who_we_are/team',
  '/who_we_are/investors',
  '/who_we_are/millions_helped/',
  '/who_we_are/contact',
  '/who_we_are/team/ron_gutman',
  '/who_we_are/vision_and_credo/smile',
  '/who_we_are/vision_and_credo/thanks_doc',

  '/what_we_make',
  '/what_we_make/website',
  '/what_we_make/for_members',
  '/what_we_make/docapp',
  '/what_we_make/for_doctors',
  '/what_we_make/for_groups',
  '/what_we_make/club_md',
  '/what_we_make/mobile_apps',
  '/what_we_make/widgets_and_apis',
  '/what_we_make/spectrum',
  '/what_we_make/get_your_widget',
  '/what_we_make/member_guides',
  '/what_we_make/member_faqs',
  '/what_we_make/medical_expert_network',
  '/what_we_make/medical_expert_faqs',
  '/what_we_make/medical_expert_guides',
  '/what_we_make/healthtap_university',
  '/what_we_make/apprx',
  '/what_we_make/doctor_mom',
  '/what_we_make/story',
  '/what_we_make/overview',
  '/what_we_make/developers',
  '/what_we_make/doctors',
  '/what_we_make/members',
  '/what_we_make/influencers',
  '/what_we_make/medical_students',
  '/what_we_make/doctors/prime_overview',
  '/what_we_make/doctors/concierge',
  '/what_we_make/doctors/prime_application',
  '/what_we_make/members/prime',
  '/what_we_make/groups',
  '/what_we_make/doctors/prime_guidelines',
  '/what_we_make/doctors/concierge_guidelines',
  '/what_we_make/developers/widgets',
  '/what_we_make/members/concierge',
  '/what_we_make/doctors#special_programs',

  '/work_with_us/overview',
  '/work_with_us/jobs/',
  '/work_with_us/internships',

  '/',
  '/send_question',
  '/sign_up',
  '/prime-trial',
  '/payment',
  '/free_consult',
  '/expert_sign_up',
  '/expert_sign_up?Concierge=true',
  '/expert_sign_up?Prime=true',
  '/experts',
  '/resetpw',
  '/login',
  '/sessions/new_dev',
  '/static/demo',
  '/concierge/learn-and-apply',
  '/terms',
  '/terms/privacy_sharing',
  '/terms/privacy_statement',
  '/terms/dmca',
  '/terms/additional_info',
  '/forgotpw',
  '/ask_doctors',
  '/doctors_concierge',
  '/online-doctor',
];

// seo pages
var seo_page_urls = [
  '/search/diabetes',
  '/experts/10000090',
  '/multi_tip/863952_981391_1115633',
  '/news/14124',
  '/moment/368',
  '/apps/5852',
  '/topics/diabetes',
  '/experts_by_specialty',
  '/experts_by_specialty/adhd-and-autism',
  '/user_questions/51861',
  '/browse_by_specialty',
  '/answers_by_specialty',
  '/answers_by_specialty/hematology?order_by=D',
  '/browse_by_expert/10000090',
  '/featured_topics',
];



// p.promise = browser
//   .init({ browserName: browser_name })
//   .setAsyncScriptTimeout(30000)

var u = require('./util.js');

describe('Logged Out Pages', function(){
  _.each( static_page_urls, function(url, index){
    it(' GET '+url+' => 200', function( done ){
      var path = environments[environment]+url;
      request( { uri: path, timeout: 4000 }, function(err, response, body){
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