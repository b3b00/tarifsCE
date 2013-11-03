
(function () {  // anonymous wrapper


	var app = angular.module('prices', ['ui.bootstrap']);

	
	app.controller('PriceController', ['$scope', '$http', PriceController]);




var Utf8 = {
 
	// public method for url encoding
	encode : function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";
 
		for (var n = 0; n < string.length; n++) {
 
			var c = string.charCodeAt(n);
 
			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
 
		}
 
		return utftext;
	},
 
	// public method for url decoding
	decode : function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;
 
		while ( i < utftext.length ) {
 
			c = utftext.charCodeAt(i);
 
			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			}
			else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			}
			else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
 
		}
 
		return string;
	}
 
}


	function PriceController($scope, $http) { 

		//$scope.delContact = Contact.delContact;
		//Contact.getAll();
	   
	   	initData = function(data) {
	   		//console.log(data);
			$scope.lastUpdate = data.lastUpdate;
			$scope.prices = data.prices;    
			$scope.activeTab = new Array();
			$scope.activeTab[0] = true;
			for (i = 1; i < data.length; i++) {
				$scope.activeTab[i] = false;
			}
	   	}


	   	var cachePath = "offline/cache.dat";

	   	getDatastore = function() {

	   		var Datastore = require('nedb');
  			db = new Datastore({ 'filename': this.cachePath, 'autoload':true });
  			db.loadDatabase(function (err) {    // Callback is optional
  				if (err != null) {
  					console.log('error when loadDatabase :: '+err);
  				}
			});
  			console.log('datastore get');
  			return db;	
	   	} 

	   	saveCacheNEDB = function(data) {
	   		console.log('');
	   		console.log('');
	   		console.log('');
	   		console.log('saving to cache');
	   		console.log('##################');
	   		testData = {'lastUpdate':data.lastUpdate};
	   		testData = data;
	   		testData = data.prices;

var document = { hello: 'world'
               , n: 5
               , today: new Date()
               , nedbIsAwesome: true
               , notthere: null
               , notToBeSaved: undefined  // Will not be saved
               , fruits: [ 'apple', 'orange', 'pear' ]
               , infos: { name: 'nedb' }
               };

	   		testData = document;
	   		console.log(data);
	   		console.log('##################');	
	   		db = getDatastore();
	   		db.insert(testData, function (err, newDoc) {   // Callback is optional
				if (err == null) {
					console.log('INSERT done :: ');
					//console.log(newDoc);
				}
				else {
					console.log('ERROR while inserting ! '+err);
				}
			});
	   	}

	   	getFromCacheNEDB = function() {
	   		db = getDatastore();
	   		
			 db.find({}, function (err, docs) {
				 		if (err == null) {
				 			console.log('getting data from cache');
				 			console.log(docs);				 			
				 		}
				 		else {
				 		//	console.log('ERROR while loading ! '+err);
				 		console.log('error loading');
				 		}
			 		});			
	   	}

		saveCacheLocal = function(data) {
			localStorage.lastUpdate = data.lastUpdate;
			localStorage.prices = Utf8.encode(JSON.stringify((data.prices)));
		}

		getFromCacheLocal = function () {
			//console.log(localStorage.lastUpdate);
			console.log(localStorage.prices);
			prices = eval(localStorage.prices);
			return {'lastUpdate':localStorage.lastUpdate,'prices':prices};	
		}

		saveCacheFile = function(data) {
			fs =require('fs');
			fs.writeFileSync('offline/cache.dat', JSON.stringify(data) );
		}

		getFromCacheFile = function () {
			fs = require('fs');
			var data = fs.readFileSync('offline/cache.dat',{encoding:'UTF-8'});
			return data;
		}



		getAll = function () {

			$http.get('http://ce-cgi-nord.fr/prices.json.php').success(function (data) {
				initData(data);
				saveCacheFile(data);
				
			}).error(function(data, status, headers, config) {
    			cache = getFromCacheFile();
    			initData(eval(cache));
  			});
			
			$scope.getAll = getAll;
		}

		getAll();
		
		$scope.getTotal = function() {		
			var total = 0;
			function categoTotal(items) {	
				var total = 0;
				for (i = 0; i < items.length ;i++) {
					if (items[i].quantity > 0) {
						total = total + items[i].quantity * items[i].price;
					}
				}
				return total;
			}
			for(var  catego in $scope.prices){
				total = total + categoTotal($scope.prices[catego]);
			}
			return total;
		};
		
		
		$scope.getCommand = function() {
			var command = new Array();
			for(var  catego in $scope.prices){
				items = $scope.prices[catego]
				for (i = 0; i < items.length ;i++) {
					if (items[i].quantity > 0) {		
						command.push(item[i])
					}
				}
			}
			return command;
		}
		
		$scope.clearCommand = function() {
			
			function clearCategory(items) {	
				var total = 0;
				for (i = 0; i < items.length ;i++) {					
					if (items[i].quantity > 0) {		
						items[i].quantity = '';
					}
				}
				return items;
			}
			for(var  catego in $scope.prices){
				$scope.prices[catego] = clearCategory($scope.prices[catego]);
			}
			
			$scope.prices =$scope.prices;
			
		}
		
		$scope.checkInteger = function(item) {	
			qty = item.quantity+'';		
			console.log('checking quantity ['+item.quantity+'] ');
			
			var intRegex = /^\d+$/;
			if(!intRegex.test(item.quantity)) {
				
				console.log ('['+item.quantity+'] is NOT an integer');
				item.quantity = '';
			}		
			else {
				console.log ('['+item.quantity+'] IS  an integer');
				item.quantity = item.quantity;
			}
			
			if (qty.length > 2) {
				item.quantity = '';
			}		
		}
	}

	
	/*
		filtres sur les lignes commandées
	**/

	function quantityFilterProvider() {
		return function (item) {
			var filtered = new Array();
			for (i = 0; i < item.length ;i++) {
				if (item[i].quantity > 0) {
					filtered.push(item[i]);
				}
			}
			return filtered;
		}
	}	


	app.filter('quantityFilter', quantityFilterProvider);
	
})();
