var NUM_CARS = 10;
var NUM_RIDERS = 15;

function Dispatch() {
  this.cars = [];
  this.riders = [];
  this.rides = [];
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

  for (var i=0; i<NUM_CARS; i++) {
    this.addCar();
  }

  for (var i=0; i<NUM_RIDERS; i++) {
    this.addRider();
  }

  console.log(this.cars);
  console.log(this.passengers);
}

Dispatch.prototype.getRandomLocation = function() {
  var width = this.bounds.northeast.lat - this.bounds.southwest.lat;
  var height = this.bounds.northeast.lng - this.bounds.southwest.lng;

  return {
    lat: this.bounds.southwest.lat + width * Math.random(),
    lng: this.bounds.southwest.lng + height * Math.random()
  }
}

Dispatch.prototype.addCar = function() {
  this.cars.push({
    id: Math.round(Math.random()*1000000),
    location: this.getRandomLocation()
  });
}

Dispatch.prototype.addRider = function {
  this.riders.push({
    id: Math.round(Math.random()*1000000),
    location: this.getRandomLocation()
  });
}

module.exports = new Dispatch();