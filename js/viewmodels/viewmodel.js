define([
    "knockout",
    "models/models",
    "services/services",
    "jquery"
], function(ko, models, services, $) {
    "use strict";

    var NEIGHBORHOOD_ID = "ChIJGZudLZ3FQIYREC4v5KoYUlg";

    function ViewModel() {
        var vm = this;
        vm.map = services.initMap();
        vm.placesService = services.initPlacesService(vm.map);
        vm.neighborhood = ko.observable();
        vm.locations = ko.observableArray();
        vm.markers = ko.observableArray();

        vm.getPlaceDetails = getPlaceDetails;
        vm.setNeighborhood = setNeighborhood;
        vm.clearMarkers = clearMarkers;
        vm.recenter = recenter;
        vm.locationClick = locationClick;
        vm.pagination = null;

        getPlaceDetails(NEIGHBORHOOD_ID, function(result, status) {
            if(services.checkPlaceStatus(status)) {
                return setNeighborhood(result);
            }
        });

        function getPlaceDetails(placeId, callback) {
            vm.placesService.getDetails({placeId: placeId}, callback);
        }

        function setNeighborhood(neighborhood) {
            vm.neighborhood = ko.observable(neighborhood);
            vm.map.setCenter(neighborhood.geometry.location);
            if(vm.locations().length === 0) {
                searchNeighborhood({location: neighborhood.geometry.location,
                    radius: 250});
            }
        }

        function searchNeighborhood(request) {
            request.bounds = vm.neighborhood().geometry.viewport;
            vm.placesService.nearbySearch(request, function(result, status, pagination) {
                if(services.checkPlaceStatus(status)) {
                    vm.pagination = pagination;
                    result.forEach(function(place) {
                        // vm.markers().push(services.addMarker(place, vm.map, function() {
                        //     getPlaceDetails(place.place_id, markerClick);
                        // }));
                        vm.locations.push(place);
                    });
                }
            });
        }

        function clearMarkers() {
            vm.markers().forEach(function(marker) {
                marker.setMap(null);
            });
            vm.markers = ko.observableArray();
        }

        function recenter() {
            vm.map.setCenter(vm.neighborhood().geometry.location);
            vm.map.setZoom(15);
        }

        function markerClick(place, status) {
            if(services.checkPlaceStatus(status)) {
                console.log(place.name);
            }
        }

        function checkIfMarkerExist(location) {
            var temp = (vm.markers().filter(function(marker) {
                return location.lat() == marker.position.lat() &&
                    location.lng() == marker.position.lng();
            }));
            return temp.length > 0;
        }

        function locationClick(place, e) {
            if(!checkIfMarkerExist(place.geometry.location)) {
                vm.markers().push(services.addMarker(place, vm.map, function() {
                    getPlaceDetails(place.place_id, markerClick);
                }));
            }
            vm.map.setCenter(place.geometry.location);
            vm.map.setZoom(16);
            $("nav").toggleClass("close");
        }

    }

    return ViewModel;

});
