var angular = require('angular');

angular.module('myApp').directive('addressForm', function() {
  return {
    restrict: 'E',
    templateUrl: '/html/address-form.html',
    controller: function($rootScope, $scope) {
      $scope.route = function(start, destination) {
        $rootScope.$broadcast('route', {start: start, destination: destination});
      }
    }
  }
});