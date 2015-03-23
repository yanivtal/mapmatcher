var angular = require('angular');
require('../lib/v3_epoly');

angular.module('myApp').directive('map', function() {
  var position;
  var marker = null;
  var speed = 0.000005, wait = 1;

  return {
    restrict: 'E',
    templateUrl: '/html/map.html',
    controller: function($rootScope, $scope, dispatcherService) {
      var mapOptions = {
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: { lat: 37.78136586, lng: -122.41765022},
        zoom: 14
      };

      var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

      var trafficLayer = new google.maps.TrafficLayer();
      trafficLayer.setMap(map);

      $rootScope.$on('route', function(event, data) {
        // addAddressToMap(data.start, 'red');
        // addAddressToMap(data.destination, 'green');
        renderDirections(data.start, data.destination);
      });
      

      function addAddressToMap (address, color) {
        var geocoder = new google.maps.Geocoder();

        geocoder.geocode( { 'address': address}, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            //In this case it creates a marker, but you can get the lat and lng from the location.LatLng
            var marker = new google.maps.Marker({
                position: results[0].geometry.location,
                icon: getCar(),
                draggable: false,
                map: map
            });
          } else {
            console.log("Geocode was not successful for the following reason: " + status);
          }
        });
      }

      dispatcherService.initialize(map);
        
      var steps = []

      function renderDirections(start, end){

        start = start + ' San Francisco, CA';
        end = end + ' San Francisco, CA';

      }
      
    }
  }
});