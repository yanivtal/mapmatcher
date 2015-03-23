var angular = require('angular');

angular.module('myApp').factory('dispatcherService', function(animationService) {
  function DispatcherService() {
    var NUM_CARS = 10;
    var NUM_RIDERS = 15;

    this.cars = [];
    this.riders = [];
    this.rides = {}; // Indexed by car ID
    this.bounds = {
      southwest: {
        lat: 37.76677954,
        lng: -122.44837761
      },
      northeast: {
        lat: 37.79784833,
        lng: -122.39636421
      }
    };

    this.initialize = function(map) {
      animationService.setMap(map);

      for (var i=0; i<NUM_CARS; i++) {
        var car = this.addCar();
        animationService.showObject(car);
      }

      for (var i=0; i<NUM_RIDERS; i++) {
        var rider = this.addRider();
        // animationService.showObject(rider);
      }

      // TODO: Delete
      this.requestRide(this.riders[0], this.getRandomLocation());
    }

    this.getRandomLocation = function() {
      var width = this.bounds.northeast.lat - this.bounds.southwest.lat;
      var height = this.bounds.northeast.lng - this.bounds.southwest.lng;

      return {
        lat: this.bounds.southwest.lat + width * Math.random(),
        lng: this.bounds.southwest.lng + height * Math.random()
      }
    }

    this.addCar = function() {
      var car = {
        id: Math.round(Math.random()*1000000),
        location: this.getRandomLocation(),
        type: 'car',
        status: 'free'
      }
      this.cars.push(car);
      return car;
    }

    this.addRider = function() {
      var rider = {
        id: Math.round(Math.random()*1000000),
        location: this.getRandomLocation(),
        type: 'rider'
      };
      this.riders.push(rider);
      return rider;
    }

    this.requestRide = function(rider, destination) {
      animationService.showObject(rider);
      var ride = this.matchRider(rider, destination);
      this.dispatch(ride);
    };

    this.matchRider = function(rider, destination) {
      // TODO: Optimize
      for(var i=0; i<this.cars.length; i++) {
        if(this.cars[i].status == 'free') {
          this.cars[i].status = 'pickup';
          rider.status = 'pickup';
          this.rides[this.cars[i].id] = {
            car: this.cars[i],
            rider: rider,
            pickup: rider.location,
            destination: destination
          }
          return this.rides[this.cars[i].id];
        }
      }
    };

    this.dispatch = function(ride) {
      var that = this;
      this.pickupRider(ride, function(err, result) {
        that.driveRider(ride, function(err, result) {
          that.returnCarToPool(ride, function(err, result) {

          });
        });
      });
    }

    this.pickupRider = function(ride, callback) {
      console.log('going to pickup rider');
      animationService.move(ride.car, ride.rider.location, function(err, result) {
        ride.car.location = ride.rider.location;
        callback(err, result);
      });
    }

    this.driveRider = function(ride, callback) {
      ride.car.status = 'riding';
      ride.rider.status = 'riding';
      animationService.move(ride.car, ride.destination, function(err, result) {
        ride.car.location = ride.destination;
      });
      animationService.move(ride.rider, ride.destination, function(err, result) {
        ride.rider.location = ride.destination;
        callback(err, result);
      });
    }

    this.returnCarToPool = function(ride, callback) {
      delete this.rides[ride.car];
      ride.car.status = 'free'

    }
    
  }

  return new DispatcherService();
});