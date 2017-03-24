define([
    'async!http://maps.googleapis.com/maps/api/js?key=AIzaSyCzrC2FBXXLfmnizhDmCHRVMaG6JQlvbvw'
], function(google) {
    'use strict';

    console.log(google);

    function initMap(eventListeners) {
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 14,
            draggable: true,
            mapTypeControlOptions: {
                position: google.maps.ControlPosition.TOP_RIGHT
            }
        });

        // for(var e in eventListeners) {
        //     map.addListener(e, eventListeners[e]);
        // }

        // return map;
    }

    function initPlacesService(map) {
        return new google.maps.places.PlacesService(map);
    }


    function addMarker(place, map, callback) {
        var marker = new google.maps.Marker({
            map:map,
            animation: google.maps.Animation.DROP,
            position: place.geometry.location
        });
        google.maps.event.addListener(marker, 'click', callback);
        return marker;
    }

    function checkPlaceStatus(status) {
        return status == google.maps.places.PlacesServiceStatus.OK;
    }

    function drawCircle(location, map, radius) {
        var circle = new google.maps.Circle({
            strokeColor: 'FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: 'FF0000',
            fillOpacity: 0.35,
            map: map,
            center: location,
            radius: radius
        });
        return circle;
    }

    function getAnimation() {
        return google.maps.Animation;
    }

    function createAutocompelte(ele) {
        return new google.maps.places.Autocomplete(ele);
    }

    function getInfoWindow() {
        return new google.maps.InfoWindow();
    }

    return {
        initMap: initMap,
        initPlacesService: initPlacesService,
        addMarker: addMarker,
        checkPlaceStatus: checkPlaceStatus,
        drawCircle: drawCircle,
        createAutocompelte: createAutocompelte,
        getInfoWindow: getInfoWindow,
        getAnimation: getAnimation
    };
});
