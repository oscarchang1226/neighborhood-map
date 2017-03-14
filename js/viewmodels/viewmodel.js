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
        vm.imageUrl = ko.observable("http://placehold.it/350x150");
        vm.location = ko.observable({name:"", formatted_address:"", international_phone_number:""});
        vm.locations = ko.observableArray();
        vm.markers = ko.observableArray();
        vm.radius = ko.observable(2500);
        vm.locationButtonIcon = ko.observable("chevron_right");

        vm.getLocationUrl = ko.computed(function() {
            if(vm.location() && vm.location().hasOwnProperty("url")) {
                return vm.location().url;
            }
            return "#";
        });

        vm.getOpeningHours = ko.computed(function() {
            if(vm.location() && vm.location().hasOwnProperty("opening_hours")) {
                if(vm.location().opening_hours.open_now) {
                    try {
                        var day = new Date().getDay();
                        return vm.location().opening_hours.weekday_text[day];
                    } catch(e) {
                    }
                } else {
                    return "Closed now.";
                }
            }
            return "Opening hours not available.";
        });

        vm.checkPlaceStatus = checkPlaceStatus;
        vm.getPlaceDetails = getPlaceDetails;
        vm.generateSearchRequest = generateSearchRequest;
        vm.setNeighborhood = setNeighborhood;
        vm.searchNeighborhood = searchNeighborhood;
        vm.clearMarkers = clearMarkers;
        vm.recenter = recenter;
        vm.locationClick = locationClick;
        vm.nextPhoto = nextPhoto;
        vm.previousPhoto = previousPhoto;

        vm.map.addListener("click", function(e) {
            if(e.placeId) {
                getPlaceDetails(e.placeId, mapLocationIconClick);
            } else {
                $("nav").addClass("close");
                $("#location").addClass("close");
                vm.locationButtonIcon("chevron_right");
            }
        });

        vm.map.addListener("dragstart", function(e) {
            $("nav").addClass("close");
            $("#location").addClass("close");
            vm.locationButtonIcon("chevron_right");
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
                                vm.markers().push(addMarker(place, vm.map));
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
            vm.locationButtonIcon("chevron_right");
        }

        function recenter() {
            vm.map.setCenter(vm.neighborhood().geometry.location);
            vm.map.setZoom(14);
            $("nav").addClass("close");
            $("#location").addClass("close");
            vm.locationButtonIcon("chevron_right");
        }

        function locationClick(place, e) {
            if(!checkIfMarkerExist(place.geometry.location)) {
                vm.focusedMarker = ko.observable(addMarker(place, vm.map));
                vm.markers().push(vm.focusedMarker());
            } else {
                var placeMarker = vm.markers().filter(function(m) {
                    return m.position == place.geometry.location;
                });
                if(placeMarker.length === 1) {
                    vm.focusedMarker = ko.observable(placeMarker[0]);
                }
            }
            getPlaceDetails(place.place_id, function(placeDetails, status) {
                if(services.checkPlaceStatus(status)) {
                    vm.map.setCenter(placeDetails.geometry.location);
                    vm.map.setZoom(17);
                    vm.location(placeDetails);
                    $("nav").addClass("close");
                }
            });
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
                if(!checkIfMarkerExist(place.geometry.location)) {
                    addMarker(place, vm.map);
                }
            }
        }

        function addMarker(place, map) {
            return services.addMarker(place, vm.map, function() {
                getPlaceDetails(place.place_id, markerClick);
            });
        }

        function checkIfMarkerExist(location) {
            var temp = (vm.markers().filter(function(marker) {
                return location.lat() == marker.position.lat() &&
                    location.lng() == marker.position.lng();
            }));
            return temp.length > 0;
        }

        function nextPhoto() {
            if(vm.location() && vm.location().hasOwnProperty("photos") && vm.location().hasOwnProperty("imageIdx")) {
                var l = vm.location().photos.length;
                var i = vm.location().imageIdx();
                if(i < (l-1)) {
                    vm.location().imageIdx(i+1);
                } else {
                    vm.location().imageIdx(0);
                }
            }
        }

        function previousPhoto() {
            if(vm.location() && vm.location().hasOwnProperty("photos") && vm.location().hasOwnProperty("imageIdx")) {
                var i = vm.location().imageIdx();
                if(i > 0) {
                    vm.location().imageIdx(i-1);
                } else {
                    vm.location().imageIdx(vm.location().photos.length - 1);
                }
            }
        }
    }

    return ViewModel;

});
