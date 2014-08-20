angular.module('product.services', [])


.value('fbURL', 'https://torid-fire-1265.firebaseio.com/kiekkobussi/tuotteet/')
.value('fbFieldsURL', 'https://torid-fire-1265.firebaseio.com/kiekkobussi/fields/')

.factory('Products', function($firebase, fbURL) {
  return $firebase(new Firebase(fbURL));
})

.factory('ProductsOnDate', function($firebase, fbURL, $routeParams) {
	

	if($routeParams.date){
		
		sessionStorage.setItem("kb-list-date", $routeParams.date);
		
		
		
		var timestamps = parseTimestamps($routeParams.date);

		return $firebase(
			new Firebase(fbURL)
			.startAt(timestamps[0])
			.endAt(timestamps[1])
		);
	}
	else
		return $firebase(new Firebase(fbURL));
})

.factory('Fields', function($firebase, fbFieldsURL) {
  return $firebase(new Firebase(fbFieldsURL));
})

.factory('StaticFields', function() {


  // Default Fields for all Categories
  var defaults =
    [ 
      {
        'name':'uusikaytetty',
        'fields': ['Uusi','Käytetty']
      },
      {
        'name': 'kunto',
        'fields': [1,2,3,4,5]
      }
    ];


 // Introducing Categories & 
 // Category Specific fields
   var categories = {
    'luistin': 
    [
    	{
    		'name': 'koko',
    		'fields': ['S','M','L','XL']
    	}
    ]
  ,'maila': 
    [
      {
        'name': 'mailakoko',
        'fields': ['JR','SR',]
      },
      {
        'name': 'jaykkyys',
        'fields': ['Flex1','Flex2',]
      }
    ]
    ,'default':  [ ]
  }

  // Merge Default fields and Category Specific fields
  _.map(categories, function(num,key) {
    categories[key] = num.concat(defaults);
  });





  return {
    all: function() {return categories},
    keys: function() {
        // Get all keys for CSV Headings 
        var keys = [];
        _.each(categories, function(num,key) { 
            _.each(num, function(num2,key2) {
              keys.push(num2.name)
            });
        });

        return _.uniq(keys);
    }
  }

})


  





