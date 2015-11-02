'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config([
        '$locationProvider', '$mdThemingProvider', '$mdIconProvider',
    function($locationProvider, $mdThemingProvider, $mdIconProvider) {
        $locationProvider.hashPrefix('!');
 
        $mdThemingProvider.theme('default')
            .primaryPalette('light-green')
            .accentPalette('red');
 
        // Register the user `avatar` icons
        $mdIconProvider
            .defaultIconSet('./modules/core/img/svg/avatars.svg', 128)
            .icon('menu'       , './modules/core/img/svg/menu.svg'        , 24)
            .icon('share'      , './modules/core/img/svg/share.svg'       , 24)
            .icon('google_plus', './modules/core/img/svg/google_plus.svg' , 512)
            .icon('hangouts'   , './modules/core/img/svg/hangouts.svg'    , 512)
            .icon('twitter'    , './modules/core/img/svg/twitter.svg'     , 512)
            .icon('phone'      , './modules/core/img/svg/phone.svg'       , 512);
    }
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
