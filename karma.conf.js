// Karma configuration
// Generated on Mon Jun 03 2013 12:55:42 GMT+0530 (IST)


// base path, that will be used to resolve files and exclude
basePath = '';


// frameworks to use
frameworks = ['jasmine'];


// list of files / patterns to load in the browser
files = [
    'lib/jquery.js',
    'jquery.dynoform.js',
    'tests.js'
];

/*preprocessors = {
  'jquery.dynoform.js': 'coverage'
};*/

// list of files to exclude
exclude = [
  
];


// test results reporter to use
// possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
// reporters = ['progress', 'coverage'];
 reporters = ['progress'];

coverageReporter = {
  type : 'html',
  dir : 'coverage/'
};

// web server port
port = 9876;


// cli runner port
runnerPort = 9100;


// enable / disable colors in the output (reporters and logs)
colors = true;


// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
logLevel = LOG_INFO;


// enable / disable watching file and executing tests whenever any file changes
autoWatch = true;


// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari (only Mac)
// - PhantomJS
// - IE (only Windows)
browsers = ['Chrome'];


// If browser does not capture in given timeout [ms], kill it
captureTimeout = 60000;


// Continuous Integration mode
// if true, it capture browsers, run tests and exit
singleRun = false;


// plugins to load
plugins = [
  'karma-jasmine',
  'karma-chrome-launcher',
  //'karma-coverage'
];
