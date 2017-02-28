define([
    "knockout",
    "models/models",
    "services/services"
], function(ko, models, services) {
    "use strict";

    var NEIGHBORHOOD_ID = "ChIJGZudLZ3FQIYREC4v5KoYUlg";

    function ViewModel() {
        var vm = this;
        vm.map = services.initMap();
        vm.placesService = services.initPlacesService(vm.map);
        vm.neighborhood = ko.observable();
        vm.locations = ko.observableArray();

        vm.getPlaceDetails = getPlaceDetails;
        vm.setNeighborhood = setNeighborhood;
        vm.clearMarkers = clearMarkers;
        vm.recenter = recenter;

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
                searchNeighborhood({types: "park"});
            }
        }

        function searchNeighborhood(request) {
            request.bounds = vm.neighborhood().geometry.viewport;
            vm.placesService.radarSearch(request, function(result, status) {
                if(services.checkPlaceStatus(status)) {
                    result.forEach(function(place) {
                        vm.locations().push(services.addMarker(place, vm.map, function() {
                            getPlaceDetails(place.place_id, function(p, s) {
                                if(services.checkPlaceStatus(s)) {
                                    console.log(p.name);
                                }
                            });
                        }));
                    });
                }
            });
        }

        function clearMarkers() {
            vm.locations().forEach(function(marker) {
                marker.setMap(null);
            });
            vm.locations = ko.observableArray();
        }

        function recenter() {
            vm.map.setCenter(vm.neighborhood().geometry.location);
        }

    }

    return ViewModel;

});
