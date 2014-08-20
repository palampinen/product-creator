angular.module('product', ['product.controllers','product.services','ngRoute', 'firebase', "ngSanitize", "ngCsv"])




.config(function($routeProvider) {
  $routeProvider

	
    .when('/', {
      controller:'SetCtrl',
      templateUrl:'template/set.html'
    })
	
	.when('/list', {
      controller:'ListCtrl',
      templateUrl:'template/list.html'
    })
	
	.when('/list/today', {
      redirectTo:'/list/day/'+ getToday()	// today -> redirect todays date
    })
	
	.when('/list/day/:date', {
      controller:'ListDateCtrl',
      templateUrl:'template/list.html'
    })
	

    .when('/edit/:productId', {
      controller:'EditCtrl',
      templateUrl:'template/detail.html'
    })
	
	.when('/copy/:productId', {
      controller:'CopyCtrl',
      templateUrl:'template/detail.html'
    })
	
	/*
	.when('/delete/:productId', {
      controller:'DeleteCtrl',
      templateUrl:'list.html'
    })
	*/
	
    .when('/new', {
      controller:'CreateCtrl',
      templateUrl:'template/detail.html'
    })
	
	.when('/new/:category', {
      controller:'CreateCtrl',
      templateUrl:'template/detail.html'
    })

    .when('/settings', {
      controller:'SettingsCtrl',
      templateUrl:'template/settings.html'
    })

	
    .otherwise({
      redirectTo:'/'
    });
});









