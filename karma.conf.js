module.exports = function(config){
  config.set({

    basePath : './',

    files : [
      'wpt/bower_components/angular/angular.js',
      'wpt/bower_components/angular-route/angular-route.js',
      'wpt/bower_components/angular-mocks/angular-mocks.js',
      'wpt/components/**/*.js',
      'wpt/view*/**/*.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-junit-reporter'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};
