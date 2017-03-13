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
        vm.location = ko.observable({name:"", formatted_address:""});
        vm.locations = ko.observableArray();
        vm.markers = ko.observableArray();
        vm.radius = ko.observable(2500);
        vm.locationButtonIcon = ko.observable("chevron_right");

        vm.getPhoto = ko.computed(function() {
            if(vm.location() && vm.location().photos) {
                return vm.location().photos[0].getUrl({maxWidth: 238, maxHeight: 180});
            }
            return "http://placehold.it/350x150";
        });

        vm.getLocationUrl = ko.computed(function() {
            if(vm.location() && vm.location().url) {
                return vm.location().url;
            }
            return "#";
        });

        vm.checkPlaceStatus = checkPlaceStatus;
        vm.getPlaceDetails = getPlaceDetails;
        vm.generateSearchRequest = generateSearchRequest;
        vm.setNeighborhood = setNeighborhood;
        vm.searchNeighborhood = searchNeighborhood;
        vm.clearMarkers = clearMarkers;
        vm.recenter = recenter;
        vm.locationClick = locationClick;

        vm.map.addListener("click", function(e) {
            if(e.placeId) {
                getPlaceDetails(e.placeId, mapLocationIconClick);
            } else {
                $("nav").addClass("close");
                $("#location").addClass("close");
            }
        });

        vm.map.addListener("dragstart", function(e) {
            $("nav").addClass("close");
            $("#location").addClass("close");
        });

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
                } else {
                    if(vm.locations().length === 0) {
                        vm.locations.push({name: "No results found.", vicinity:""});
                    }
                }
            });
        }

        function clearMarkers() {
            vm.markers().forEach(function(marker) {
                marker.setMap(null);
            });
            vm.markers = ko.observableArray();
            $("nav").addClass("close");
            $("#location").addClass("close");
        }

        function recenter() {
            vm.map.setCenter(vm.neighborhood().geometry.location);
            vm.map.setZoom(14);
            $("nav").addClass("close");
            $("#location").addClass("close");
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
            vm.location(place);
            $("nav").addClass("close");
        }

        function markerClick(place, status) {
            if(services.checkPlaceStatus(status)) {
                vm.location(place);
                vm.locationButtonIcon("chevron_left");
                $("#location").removeClass("close");
            }
        }

        function mapLocationIconClick(place, status) {
            if(services.checkPlaceStatus(status)) {
                vm.location(place);
                vm.locationButtonIcon("chevron_right");
                $("#location").addClass("close");
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
