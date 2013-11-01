
(function () {  // anonymous wrapper


	var app = angular.module('prices', ['ui.bootstrap']);

	
	app.controller('PriceController', ['$scope', '$http', PriceController]);



	function PriceController($scope, $http) { 

		//$scope.delContact = Contact.delContact;
		//Contact.getAll();
	   


		getAll = function () {

			$http.get('http://ce-cgi-nord.fr/prices.json.php').success(function (data) {
				console.log(data);
				$scope.lastUpdate = data.lastUpdate;
				$scope.prices = data.prices;    
				//if (data.lastUpdate > storedLastUpdate) {
					// update cache
				//}
				$scope.activeTab = new Array();
				$scope.activeTab[0] = true;
				for (i = 1; i < data.length; i++) {
					$scope.activeTab[i] = false;
				}
			}).error(function(data, status, headers, config) {
    	// return from store
  });

		$scope.getAll = getAll;


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
