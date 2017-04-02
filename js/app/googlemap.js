define([
    'jquery',
    'async!https://maps.googleapis.com/maps/api/js?key=AIzaSyCzrC2FBXXLfmnizhDmCHRVMaG6JQlvbvw'
], function($) {

    var map;
    var marker;
    var bounds;

    return {
        initMap: initMap,
        panMap: panMap,
        getDetails: getDetails,
        createMarker: createMarker,
        removeMarker: removeMarker,
        extendBounds: extendBounds
    };

    function initMap(events) {
        var springShadows = {lat: 29.8179022, lng: -95.53548160000001};
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 14,
            minZoom: 14,
            disableDefaultUI: true,
            center: springShadows
        });

        if(typeof events != 'object') {
            events = {};
        }

        for(var action in events) {
            map.addListener(action, events[action]);
        }
    }

    function panMap(latLng) {
        if(map) {
            map.panTo(latLng);
        }
    }

    function getDetails(placeId) {
        return $.ajax({
            method: 'GET',
            url: '/google/placeDetails/' + placeId
        });
    }

    function createMarker(latLng, events) {
        marker = new google.maps.Marker({
            map:map,
            animation: google.maps.Animation.BOUNCE,
            position: latLng
        });

        for(var action in events) {
            marker.addListener(action, events[action]);
        }
    }

    function removeMarker() {
        if(marker) {
            marker.setMap(null);
        }
    }

    function extendBounds(arr) {
        if(!bounds) {
            bounds = map.getBounds();
        }
        var latLng;
        arr.forEach(function(coordinates) {
            latLng = new google.maps.LatLng(coordinates.latitude, coordinates.longitude);
            bounds.union(new google.maps.LatLngBounds(latLng));
        });
        map.fitBounds(bounds);
    }

});
