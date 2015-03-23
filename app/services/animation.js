var angular = require('angular');

angular.module('myApp').factory('animationService', function() {
  function AnimationService() {
    var context = this;
    var map;
    var renderOptions;
    var directionColor = '#FF0000';
    var directionsService = new google.maps.DirectionsService();
    var iconSizeX = 30;
    var iconSizeY = 30;
    var carIcon = {
      url: '/img/car1.svg',
      scaledSize: new google.maps.Size(iconSizeX, iconSizeY),
      anchor: new google.maps.Point(iconSizeX/2, iconSizeY/2)
    };
    var riderIcon = {
      url: '/img/person1.svg',
      scaledSize: new google.maps.Size(iconSizeX, iconSizeY),
      anchor: new google.maps.Point(iconSizeX/2, iconSizeY/2)
    };

    this.setMap = function(newMap) {
      map = newMap;
      renderOptions = {
        map: map,
        preserveViewport: true,
        suppressMarkers: true
      };
    }

    this.showObject = function(object) {
      switch(object.type) {
        case 'car':
          object.marker = new google.maps.Marker({
            position: object.location,
            icon: carIcon,
            draggable: false,
            map: map
          });
          break;
        case 'rider':
          object.marker = new google.maps.Marker({
            position: object.location,
            icon: riderIcon,
            draggable: false,
            map: map
          });
          break
      }
    };

    this.hideObject = function(object) {
      object.marker.setMap(null);
      delete object.marker;
    };

    this.move = function(object, end, callback) {
      var rideAnimation = new RideAnimation();
      rideAnimation.start(object.marker, object.location, end, callback);
    };

    function RideAnimation() {
      var animationContext = this; 
      var directionsDisplay = new google.maps.DirectionsRenderer(renderOptions);
      this.timerHandle = null;

      this.polyline = new google.maps.Polyline({
        path: [],
        strokeColor: directionColor,
        strokeWeight: 3
      });

      this.polyline2 = new google.maps.Polyline({
        path: [],
        strokeColor: directionColor,
        strokeWeight: 3
      });

      var travelMode = google.maps.DirectionsTravelMode.DRIVING;

      var step = 50; // 5; // metres
      var tick = 100; // milliseconds
      // var k=0;
      var speed = "";
      var lastVertex = 1;
      var animationCallback;

      this.start = function(marker, start, end, callback) {

        this.marker = marker; // WEIRD
        animationCallback = callback;
        
        var request = {
          origin: typeof start == 'object' ? start.lat + ',' + start.lng : start,
          destination: typeof end == 'object' ? end.lat + ',' + end.lng : end,
          travelMode: travelMode
        };

        // Route the directions and pass the response to a
        // function to create markers for each step.
        var that = this;
        directionsService.route(request, function(response, status) {
          if (status == google.maps.DirectionsStatus.OK){
            directionsDisplay.setDirections(response);

            var route = response.routes[0];
            startLocation = new Object();
            endLocation = new Object();

            var path = route.overview_path;
            var legs = route.legs;
            for (i = 0; i < legs.length; i++) {
              if (i == 0) { 
                startLocation.latlng = legs[i].start_location;
                startLocation.address = legs[i].start_address;
                // marker = createMarker(legs[i].start_location);
              }
              endLocation.latlng = legs[i].end_location;
              endLocation.address = legs[i].end_address;
              var steps = legs[i].steps;
              for (j = 0; j < steps.length; j++) {
                var nextSegment = steps[j].path;
                for (var k = 0; k < nextSegment.length; k++) {
                  animationContext.polyline.getPath().push(nextSegment[k]);
                }
              }
            }
            animationContext.polyline.setMap(map);
            that.startAnimation();
          }                                                  
        });
      }

      this.updatePoly = function (d) {
        // Spawn a new polyline every 20 vertices, because updating a 100-vertex poly is too slow
        if (animationContext.polyline2.getPath().getLength() > 20) {
          animationContext.polyline2=new google.maps.Polyline([animationContext.polyline.getPath().getAt(lastVertex-1)]);
          // map.addOverlay(polyline2) ALREADY
        }

        if (animationContext.polyline.GetIndexAtDistance(d) < lastVertex+2) {
           if (animationContext.polyline2.getPath().getLength()>1) {
             animationContext.polyline2.getPath().removeAt(animationContext.polyline2.getPath().getLength()-1)
           }
           animationContext.polyline2.getPath().insertAt(animationContext.polyline2.getPath().getLength(),animationContext.polyline.GetPointAtDistance(d));
        } else {
          animationContext.polyline2.getPath().insertAt(animationContext.polyline2.getPath().getLength(),endLocation.latlng);
        }
      }

      this.animate = function (d) {
        if (d>animationContext.eol) {
          // map.panTo(endLocation.latlng);
          animationContext.marker.setPosition(endLocation.latlng);

          return animationCallback();
        }
        var p = animationContext.polyline.GetPointAtDistance(d);
        // map.panTo(p);
        animationContext.marker.setPosition(p);
        this.updatePoly(d);
        var that = this;
        animationContext.timerHandle = setTimeout(function(){
          that.animate(d+step);
        }, tick);
      }

      this.startAnimation = function() {
        animationContext.eol = google.maps.geometry.spherical.computeLength(animationContext.polyline.getPath().getArray());
        animationContext.polyline2 = new google.maps.Polyline({path: [animationContext.polyline.getPath().getAt(0)], strokeColor:"#0000FF", strokeWeight:10});
        this.animate(50);
      }
    }
    
  }

  return new AnimationService();
});