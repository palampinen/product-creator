angular.module('product.controllers', [])


/*
*
* Controllers of application 
*
* Includes:
* 	- SetCtrl
*	- ListCtrl
*	- CreateCtrl
*	- EditCtrl
*
*
*/

.controller('SetCtrl', function($scope, $route, $firebase, Products, fbURL) {
	
	/*
	*	Ugly workaround to reload products
	* 	using localStorage flag "kb-productcache"
	* 	 	TODO: better solution
	*/
	if( localStorage.getItem('kb-productcache') == 'flag' ){
		localStorage.setItem('kb-productcache','')
		setTimeout( function() {	
			location.reload();
		},1000);
	}else
		

	

	
	//$scope.products = Products;
	var productObj2 = {},
		single2,
		dataArray2 = [];
	
	Products.$on('loaded', function(snapshot) {
		

		_.each(snapshot,function(single2) {
						
			if(productObj2[single2.date] == null){
				productObj2[single2.date] = {};
				productObj2[single2.date]['timestamp'] = single2.timestamp;
				productObj2[single2.date]['date'] = single2.date;
				productObj2[single2.date]['count'] = 0;
			}
			productObj2[single2.date]['count']++;
		});
		
		for (var prop in productObj2) {
			if(productObj2.hasOwnProperty(prop)){
				dataArray2.push(productObj2[prop])
			}
		}
		
		$scope.sets = dataArray2;
		localStorage.setItem('kb-productcache','flag');
		$('.loader').hide();
	});
	
		
	/*
	var newData = new Firebase(fbURL);
	var productObj = {},
		single,
		dataArray = [];

	
	newData.once('value', function(allProductsSnapshot) {
		
		allProductsSnapshot.forEach(function(productSnapshot) {

			single = productSnapshot;
			
			if(productObj[single.child('date').val()] == null){
				productObj[single.child('date').val()] = {};
				productObj[single.child('date').val()]['timestamp'] = single.child('timestamp').val();
				productObj[single.child('date').val()]['date'] = single.child('date').val();
				productObj[single.child('date').val()]['count'] = 0;
			}
			productObj[single.child('date').val()]['count']++;
		});
		

		
		for (var prop in productObj) {
			if(productObj.hasOwnProperty(prop)){
				dataArray.push(productObj[prop]);
			}
		}
		
		$scope.sets = dataArray;
		
	});
	*/
	
	
	

})

.controller('ListCtrl', function($scope, Products,  $firebase,fbURL) {
  sessionStorage.setItem("kb-list-date", "");
  $scope.products = Products;
  
  $scope.remove = function(id) {
		$firebase(new Firebase(fbURL+id)).$remove();
  }
  
})

.controller('ListDateCtrl', function($scope, $location, $routeParams, $firebase,fbURL, ProductsOnDate, StaticFields ) {
	$scope.products = ProductsOnDate;
	// Default Static Headings
	$scope.headings = ['name','description','price','size','sku','category'];

	// Custom Shop specific Headings
	$scope.headings = $scope.headings.concat(StaticFields.keys());

	var addCSVData = function(obj) {

		obj.uusikaytetty = 'Käytetty';

	}



	
	/* CSV Export */
 	$scope.filename = 'tuotteet-'+$routeParams.date;
	$scope.getArray = [];
	$scope.getArray.push($scope.headings)
	
	var timestamps = parseTimestamps($routeParams.date);
	var data = new Firebase(fbURL)
			.startAt(timestamps[0])
			.endAt(timestamps[1]);
	var productObj;
		
		
	data.on('value', function(allMessagesSnapshot) {
		
		allMessagesSnapshot.forEach(function(messageSnapshot) {
				productObj = {};
				_.each( $scope.headings, function(val){
					productObj[val] = messageSnapshot.child(val).val();

				} )
				/*
				productObj.name 		= messageSnapshot.child('name').val();
				productObj.description 	= messageSnapshot.child('description').val();
				productObj.price 		= messageSnapshot.child('price').val();
				productObj.size 		= messageSnapshot.child('size').val();
				productObj.sku 			= messageSnapshot.child('sku').val();
				productObj.category 	= messageSnapshot.child('category').val();
				*/
				addCSVData(productObj);

				$scope.getArray.push(productObj);
				
		});
	});
		



	/* Basic functions */

    $scope.remove = function(id) {
		$firebase(new Firebase(fbURL+id)).$remove();
	}


	

	$scope.back = function() {
		$location.path('/');
	};

	
	
	/* 
		Img Fetch Action
	*/

	var IMG_URL = 'IMPORT/'+$routeParams.date+'/',
		img;
	
	$.ajax({
	  url: IMG_URL,
	  success: function(data){
		
		
		var alertMsg = $('<div>')
			.addClass('alert alert-success')
			.append('<i class=" glyphicon glyphicon-camera"></i> '+ $(data).find("td > a:contains(.)").size() +' kuvaa kansiossa <strong>'+IMG_URL+'</strong>')
		$('#img-cart').html(alertMsg);
		
		$(data).find("td > a:contains(.)").each(function(){
			
			img = $('<span>')
				.addClass('img-col')
				.append(
					$('<img>')
					.attr('src',IMG_URL+$(this).attr('href'))
				);
			$('#img-cart').append(img);
		
		});
		
		$('#img-cart').imagesLoaded( function() {
			$('#img-cart img').each(function() {
				if( $(this).width() < $(this).height() )
					$(this).css('marginTop','-'+( ($(this).height()/$(this).width() - 1) * $(this).parent().height() / 2  )+'px').addClass('portrait');
				else
					$(this).css('marginLeft','-'+( ($(this).width()/$(this).height() - 1) * $(this).parent().width() / 2  )+'px').addClass('landscape');
			});
		});
		
	  },
	  error: function(data){
		var alertMsg = $('<div>')
			.addClass('alert alert-info')
			.append('Ei kuvia kansiossa: <strong>'+IMG_URL+'</strong>')
		$('#img-cart').html(alertMsg);
	  }
	});
	

  
})

.controller('CreateCtrl', function($scope, $location, $routeParams, $timeout, Products, StaticFields) {
  

  // Prefilled Category
  $scope.product = {
	category: $routeParams.category
  }
  
  $scope.save = function() {
	console.log('test');
	// Add Create Date
	var d = new Date();
	$scope.product.date =  d.getDate() + '.' + (parseInt(d.getMonth())+1) + '.' + d.getFullYear();
	$scope.product.timestamp = d.getTime();
	$scope.product.$priority = d.getTime();
	
    Products.$add($scope.product, function() {
		
		$timeout(function() { 
			if(sessionStorage.getItem("kb-list-date") != '')
				$location.path('/list/day/'+sessionStorage.getItem("kb-list-date")); 
			else
				$location.path('/list');
		});
    });
  };
  
  
  $scope.cancel = function() {
	if(sessionStorage.getItem("kb-list-date") != '')
		$location.path('/list/day/'+sessionStorage.getItem("kb-list-date")); 
	else
		$location.path('/list');
  };


  $scope.customfields = StaticFields.all(); // [$scope.product.category]

  

})

.controller('EditCtrl', function($scope, $location, $routeParams, $firebase, fbURL,StaticFields) {
    var productUrl = fbURL + $routeParams.productId;
    $scope.product = $firebase(new Firebase(productUrl));

    $scope.destroy = function() {
		$scope.product.$remove();
		if(sessionStorage.getItem("kb-list-date") != '')
				$location.path('/list/day/'+sessionStorage.getItem("kb-list-date")); 
		else
				$location.path('/list');
		
    };

    $scope.save = function() {

	  $scope.product.$priority = $scope.product.timestamp;
      $scope.product.$save();
      	if(sessionStorage.getItem("kb-list-date") != '')
				$location.path('/list/day/'+sessionStorage.getItem("kb-list-date")); 
		else
				$location.path('/list');
		
    };
	
	$scope.cancel = function() {
		if(sessionStorage.getItem("kb-list-date") != '')
			$location.path('/list/day/'+sessionStorage.getItem("kb-list-date")); 
		else
			$location.path('/list');
	};
	
	
	$scope.customfields = StaticFields.all();
})

.controller('CopyCtrl', function($scope, $location, $routeParams, $firebase, fbURL, $timeout,Products,StaticFields) {
    
	var productUrl = fbURL + $routeParams.productId,
		productCopy = new Firebase(productUrl),
		newProductObj = {};
	
	productCopy.on('value', function(snapshot) {
		newProductObj = snapshot.val();
		$scope.product = newProductObj;
	});
  
	$scope.save = function() {
		console.log('test');
		// Add Create Date
		var d = new Date();
		$scope.product.date =  d.getDate() + '.' + (parseInt(d.getMonth())+1) + '.' + d.getFullYear();
		$scope.product.timestamp = d.getTime();
		$scope.product.$priority = d.getTime();
	
		Products.$add($scope.product, function() {
		
			$timeout(function() { 
				if(sessionStorage.getItem("kb-list-date") != '')
					$location.path('/list/day/'+sessionStorage.getItem("kb-list-date")); 
				else
					$location.path('/list');
			});
		});
	};
  
  
	$scope.cancel = function() {
		if(sessionStorage.getItem("kb-list-date") != '')
			$location.path('/list/day/'+sessionStorage.getItem("kb-list-date")); 
		else
			$location.path('/list');
	};
	

	$scope.customfields = StaticFields.all();
})


.controller('SettingsCtrl', function($scope, $timeout, Fields) {
	$scope.fields = Fields;


	$scope.save = function() {
		$scope.field.attributes = [];

		Fields.$add($scope.field, function() {
			$timeout(function(data) { 
				console.log('field added', $scope.field)
				$scope.field.name = '' 
			});
		});
	};


	$scope.addAttribute = function(id,attr) {
		
 		
		
		if(!$scope.fields[id].attributes) 
			$scope.fields[id].attributes = new Array();

		$scope.fields[id].attributes.push(attr);


		console.log($scope.fields);
		
		/*
		$scope.fields.$save($scope.field).then(function(data) {
			//$location.path('/');
		});
		*/
		
	}
	


});