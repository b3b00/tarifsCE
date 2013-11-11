
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
	   

  tsToDate = function(ts) {
        var a = new Date(ts*1000); 
      var year = a.getFullYear();
      var month = "00"+(a.getMonth()+1);        
    
    month = month.substring(month.length-2,month.length);    
      var date = "00"+a.getDate();
      date = date.substring(date.length-2,date.length);     
      var hour = a.getHours();
      var min = a.getMinutes();
      var sec = a.getSeconds();
      var time = date+'/'+month+'/'+year+' '+hour+':'+min+':'+sec ;
      return time;
    }


	   	initData = function(data) {
	   		//console.log(data);

			
			// will display time in 10:30:23 format
			//var formattedTime = tsToDate(date);

			$scope.lastUpdate = tsToDate(data.lastUpdate);
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
	   		
	   		testData = data;
	   		
	   		
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
			content = myString = JSON.stringify(data).replace(/[\r\n]/g, "");
			localStorage.prices = Utf8.encode(content);
		}

		getFromCacheLocal = function () {
			//console.log(localStorage.lastUpdate);
			//console.log(localStorage.prices);
			prices = localStorage.prices;
			return {'lastUpdate':localStorage.lastUpdate,'prices':prices};	
		}

		saveCacheFile = function(data) {
			console.log("saving to fs cache offline/cache.dat");
			fs =require('fs');
			content = myString = JSON.stringify(data).replace(/[\r\n]/g, "");
			fs.writeFileSync('offline/cache.dat',  content);
		}

		getFromCacheFile = function () {
			console.log("loading from fs cache offline/cache.dat");
			fs = require('fs');
			var data = fs.readFileSync('offline/cache.dat',{encoding:'UTF-8'});
			return data;
		}



		getAll = function () {
			console.log("controller.getAll() - in");
			$http.get('http://ce-cgi-nord.fr/prices.json.php').success(function (data) {	
				console.log("controller.getAll - HTTP GET success ");
				initData(data);
				saveCacheLocal(data);
				
			}).error(function(data, status, headers, config) {
				console.log("controller.getAll - HTTP GET error :: "+status);
    			cache = getFromCacheLocal();
    			cache = cache.prices.replace(/[\n\r]/g,"");
    			//console.log(cache);
    			initData(eval('('+cache+')'));
  			});
			
			$scope.getAll = getAll;
			console.log("controller.getAll() - out");
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
			//console.log('checking quantity ['+item.quantity+'] ');
			
			var intRegex = /^\d+$/;
			if(!intRegex.test(item.quantity)) {
				
				console.log ('['+item.quantity+'] is NOT an integer');
				item.quantity = '';
			}		
			else {
				//console.log ('['+item.quantity+'] IS  an integer');
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
			//console.log("quantityFilter in : "+item.length);
			var filtered = new Array();

			for (i = 0; i < item.length ;i++) {
				if (item[i].quantity > 0) {
					filtered.push(item[i]);
				}
			}
			//console.log("quantityFilter out : "+filtered.length);
			return filtered;
		}
	}	


	app.filter('quantityFilter', quantityFilterProvider);
	
})();
