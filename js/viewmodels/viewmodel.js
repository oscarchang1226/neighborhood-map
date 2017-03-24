define([
    'knockout',
    'services/googlemap.service',
    'services/broadbandmap.service',
], function(ko, google, bbm) {
    'use strict';

    function ViewModel() {
        var vm = this;

        vm.map = google.initMap({
            'click': mapClickEvent,
            'dragstart': mapDragStartEvent
        });
        vm.placesService = google.initPlacesService(vm.map);
        vm.pagination = null;

        vm.neighborhood = ko.observable({});
        vm.userInput = ko.observable();
        vm.focusedMarker = ko.observable({});
        vm.bbmHeaders = ko.observable({});
        vm.demographics = ko.observable({});
        vm.imageUrl = ko.observable('http://placehold.it/350x150');
        vm.location = ko.observable({name:'', formatted_address:'', international_phone_number:''});
        vm.locations = ko.observableArray();
        vm.markers = ko.observableArray();
        vm.radius = ko.observable(2500);
        vm.locationButtonIcon = ko.observable('chevron_right');

        vm.getLocationUrl = ko.computed(function() {
            if(vm.location() && vm.location().hasOwnProperty('url')) {
                return vm.location().url;
            }
            return '#';
        });

        vm.getOpeningHours = ko.computed(function() {
            if(vm.location() && vm.location().hasOwnProperty('opening_hours')) {
                if(vm.location().opening_hours.open_now) {
                    try {
                        var day = new Date().getDay() - 1;
                        day = day == -1? 6 : day;
                        return vm.location().opening_hours.weekday_text[day];
                    } catch(e) {
                    }
                } else {
                    return 'Closed now.';
                }
            }
            return 'Opening hours not available.';
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
        vm.toggleMarkerBounce = toggleMarkerBounce;
        vm.getDemographics = getDemographics;
        vm.getDemographicsInfo = getDemographicsInfo;

        function mapClickEvent(e) {
            // TODO: close all ui panels
        }

        function mapDragStartEvent(e) {
            // TODO: close all ui panels
        }

        function checkPlaceStatus(status) {
            // TODO: check google place status
        }

        function getPlaceDetails(placeId, callback) {
            // TODO: get google place details
        }

        function generateSearchRequest(useName) {
            // TODO: generate search request
        }

        function setNeighborhood(neighborhood) {
            // TODO: set neighborhood
        }

        function searchNeighborhood(request) {
            // TODO: search neighborhood
        }

        function clearMarkers() {
            // TODO: clear markers
        }

        function recenter() {
            // TODO: recenter map
        }

        function locationClick(place, e) {
            // TODO: set place, recenter to place, open info window, add marker, animate marker
        }

        function markerClick(place, status) {
            // TODO: set place, recenter to place, open info window, animate marker
        }

        function mapLocationIconClick(place, status) {
            // TODO: set place, recenter to place, open info window, add marker, animate marker
        }

        function addMarker(place, map) {
            // TODO: create marker, add marker to markers, set click callback
        }

        function checkIfMarkerExist(location) {
            // TODO: check if marker exist by filtering lat & lng
        }

        function nextPhoto() {
            // TODO: get next photo for google place image. increment image index
        }

        function previousPhoto() {
            // TODO: get previous photo for google place image. increment image index
        }

        function closeLocationPanel() {
            // TODO: change location button to chevron_right and add close class from #location
        }

        function openLocationPanel() {
            // TODO: change location button to chevron_right and remove close class from #location
        }

        function toggleMarkerBounce(marker) {
            // TODO: active marker bounce animation
        }
    }

    return ViewModel;

});
