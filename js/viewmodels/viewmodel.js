define([
    "knockout",
    "models/models",
    "services/services",
    "jquery"
], function(ko, models, services, $) {
    "use strict";

    function ViewModel() {
        var vm = this;

        vm.map = services.initMap();
        vm.placesService = services.initPlacesService(vm.map);
        vm.pagination = null;

        vm.neighborhood = ko.observable();
        vm.userInput = ko.observable();
        vm.focusedMarker = ko.observable();
        vm.locations = ko.observableArray();
        vm.markers = ko.observableArray();
        vm.radius = ko.observable(2500);

        vm.checkPlaceStatus = checkPlaceStatus;
        vm.getPlaceDetails = getPlaceDetails;
        vm.generateSearchRequest = generateSearchRequest;
        vm.setNeighborhood = setNeighborhood;
        vm.searchNeighborhood = searchNeighborhood;
        vm.clearMarkers = clearMarkers;
        vm.recenter = recenter;
        vm.locationClick = locationClick;

        function checkPlaceStatus(status) {
            return services.checkPlaceStatus(status);
        }

        function getPlaceDetails(placeId, callback) {
            vm.placesService.getDetails({placeId: placeId}, callback);
        }

        function generateSearchRequest(useName) {
            var request = {
                location: vm.neighborhood().geometry.location,
                radius: vm.radius()
            };
            if(useName) {
                request.name = vm.userInput().trim();
            }
            return request;
        }

        function setNeighborhood(neighborhood) {
            vm.neighborhood = ko.observable(neighborhood);
            vm.map.setCenter(neighborhood.geometry.location);
        }

        function searchNeighborhood(request) {
            // request.bounds = vm.neighborhood().geometry.viewport;
            vm.locations.removeAll();
            vm.placesService.nearbySearch(request, function(result, status, pagination) {
                if(services.checkPlaceStatus(status)) {
                    vm.pagination = pagination;
                    // console.log(result);
                    result.forEach(function(place) {
                        if(place.types.indexOf("political") < 0) {
                            vm.locations.push(place);
                            if(!checkIfMarkerExist(place.geometry.location)) {
                                vm.markers().push(services.addMarker(place, vm.map, function() {
                                    getPlaceDetails(place.place_id, markerClick);
                                }));
                            }
                        }
                    });
                }
            });
        }

        function clearMarkers() {
            vm.markers().forEach(function(marker) {
                marker.setMap(null);
            });
            vm.markers = ko.observableArray();
            $("nav").addClass("close");
        }

        function recenter() {
            vm.map.setCenter(vm.neighborhood().geometry.location);
            vm.map.setZoom(14);
            $("nav").addClass("close");
        }

        function locationClick(place, e) {
            if(!checkIfMarkerExist(place.geometry.location)) {
                vm.focusedMarker = ko.observable(services.addMarker(place, vm.map, function() {
                    getPlaceDetails(place.place_id, markerClick);
                }));
                vm.markers().push(vm.focusedMarker());
            } else {
                var placeMarker = vm.markers().filter(function(m) {
                    return m.position == place.geometry.location;
                });
                if(placeMarker.length === 1) {
                    vm.focusedMarker = ko.observable(placeMarker[0]);
                }
            }
            vm.map.setCenter(place.geometry.location);
            vm.map.setZoom(17);
            $("nav").addClass("close");
        }

        function markerClick(place, status) {
            if(services.checkPlaceStatus(status)) {
                console.log(place);
            }
        }

        function checkIfMarkerExist(location) {
            var temp = (vm.markers().filter(function(marker) {
                return location.lat() == marker.position.lat() &&
                    location.lng() == marker.position.lng();
            }));
            return temp.length > 0;
        }

    }

    return ViewModel;

});
