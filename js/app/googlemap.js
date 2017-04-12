define([
    'jquery',
    'async!https://maps.googleapis.com/maps/api/js?key=AIzaSyCzrC2FBXXLfmnizhDmCHRVMaG6JQlvbvw'
], function($) {

    var map;
    var marker;
    var focused;
    var bounds;

    return {
        initMap: initMap,
        panMap: panMap,
        getDetails: getDetails,
        nearbySearch: nearbySearch,
        createMarker: createMarker,
        removeMarker: removeMarker,
        extendBounds: extendBounds,
        panMarker: panMarker,
        createFocused: createFocused,
        removeFocused: removeFocused,
        panFocused: panFocused,
        recenter: recenter
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

    function nearbySearch(q) {
        return $.ajax({
            method: 'GET',
            url: '/google/nearbySearch',
            data: q
        });
    }

    function createMarker(latLng, events, options) {
        options = Object.assign({
            map:map,
            animation: google.maps.Animation.BOUNCE,
            position: latLng
        }, options || {});
        marker = new google.maps.Marker(options);

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

    function panMarker(latLng) {
        if(!marker) {
            createMarker(latLng);
        } else {
            if(!marker.getMap()) {
                marker.setMap(map);
            }
            marker.setPosition(latLng);
        }
    }

    function createFocused(latLng, events, options) {
        options = Object.assign({
            map:map,
            position: latLng,
            icon: 'http://maps.google.com/mapfiles/ms/micons/blue-dot.png'
        }, options || {});
        focused = new google.maps.Marker(options);

        for(var action in events) {
            focused.addListener(action, events[action]);
        }
    }

    function removeFocused() {
        if(focused) {
            focused.setMap(null);
        }
    }

    function panFocused(latLng, events) {
        if(!focused) {
            createFocused(latLng, events);
        } else {
            if(!focused.getMap()) {
                focused.setMap(map);
            }
            focused.setPosition(latLng);
        }
    }

    function recenter() {
        if(map) {
            map.panTo({lat: 29.8179022, lng: -95.53548160000001});
        }
    }

});
