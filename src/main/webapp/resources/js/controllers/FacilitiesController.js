//var FacilitiesController = function($scope,$routeParams, $location) {
//	
//	$scope.initGrid = function() {
//		$scope.myData = [{name: "Moroni", age: 50},
//		                 {name: "Tiancum", age: 43},
//		                 {name: "Jacob", age: 27},
//		                 {name: "Nephi", age: 29},
//		                 {name: "Enos", age: 34}];
//		
//		$scope.gridOptions = { data: 'myData' };
//	};
//	
//	$scope.initGrid();
//	
//};
//

var FacilitiesController = function($scope, $http) {
	
    $scope.filterOptions = {
            filterText: "",
            useExternalFilter: true
    };
    $scope.totalServerItems = 0;
    $scope.pagingOptions = {
        pageSizes: [5, 10, 20],
        pageSize: 5,
        currentPage: 1
    };  
    $scope.setPagingData = function(data, page, pageSize){	
        var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
        $scope.myData = pagedData;
        $scope.totalServerItems = data.length;
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };
    $scope.getPagedDataAsync = function (pageSize, page, searchText) {
        setTimeout(function () {
            var data;
            if (searchText) {
                var ft = searchText.toLowerCase();
                $http.get('facilities/facilities.json').success(function (facilitiesList) {		
                    data = facilitiesList.filter(function(item) {
                        return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
                    });
                    $scope.setPagingData(data,page,pageSize);
                });            
            } else {
                $http.get('facilities/facilities.json').success(function (facilitiesList) {
                    $scope.setPagingData(facilitiesList,page,pageSize);
                });
            }
        }, 100);
    };
	
    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
	
    $scope.$watch('pagingOptions', function (newVal, oldVal) {
        if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
          $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);
    $scope.$watch('filterOptions', function (newVal, oldVal) {
        if (newVal !== oldVal) {
          $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);
	
    $scope.gridOptions = {
        data: 'myData',
        enablePaging: true,
        showFooter: true,
        totalServerItems:'totalServerItems',
        pagingOptions: $scope.pagingOptions,
        filterOptions: $scope.filterOptions
    };
};