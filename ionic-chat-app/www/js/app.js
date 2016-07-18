// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('IonicChatApp', ['ionic', 'chatapp.controllers','chatapp.services', 'chatapp.directives', 'ngCordova','ngCordovaOauth', 'firebase'])


.run(function ($ionicPlatform, $rootScope, $state) {
    $ionicPlatform.ready(function () {
        $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
            if (error === 'AUTH_REQUIRED') {
                $state.go('main');
            }
        });
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
      if (cordova.platformId === 'ios' && window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.constant('FBURL', 'https://ionic-chat-app-1374.firebaseio.com/')
.constant('GOOGLEKEY', '874094078195-ng18b0t1v9ss0kb5kb2pfh5jvgujo5ud.apps.googleusercontent.com')
.constant('GOOGLEAUTHSCOPE', ['email'])

.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  $ionicConfigProvider.backButton.previousTitleText(false);
  $ionicConfigProvider.views.transition('platform');
  $ionicConfigProvider.navBar.alignTitle('center');

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
  $stateProvider.state('main', {
        url: '/',
        templateUrl: 'templates/main.html',
        controller: 'MainCtrl',
        cache: false,
        resolve: {
            'currentAuth': ['FBFactory', 'Loader',function (FBFactory, Loader) {
                Loader.show('Checking Auth..');
                return FBFactory.auth().$waitForSignIn();
            }]
        }
  })
  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    cache: false,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
      url: '/dash',
      cache: false,
      views: {
        'tab-dash': {
            templateUrl: 'templates/tab-dash.html',
            controller: 'DashCtrl'
        }
        },
        resolve: {
            'currentAuth': ['FBFactory', function(FBFactory) {
                return FBFactory.auth().$requireSignIn();
            }]
        }
  })

  .state('tab.chats', {
      url: '/chats',
      cache: false,
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      },
      resolve: {
          'currentAuth': ['FBFactory', function (FBFactory) {
              return FBFactory.auth().$requireSignIn();
          }]
      }
  })
  .state('tab.account', {
      url: '/account',
      cache: false,
      views: {
          'tab-account': {
              templateUrl: 'templates/tab-account.html',
              controller: 'AccountCtrl'
          }
      },
      resolve: {
        'currentAuth': ['FBFactory', function(FBFactory) {
            return FBFactory.auth().$requireSignIn();
        }]
      }
  })
  .state('chat-detail', {
      url: '/chats/:otherUser',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl',
          cache: false,
          resolve: {
              'currentAuth': ['FBFactory', 'Loader',function (FBFactory, Loader) {
                  Loader.show('Checking Auth..');
                  return FBFactory.auth().$requireSignIn();
              }]
          }
        }
      }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/');

});
