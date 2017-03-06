define([
    "googlemaps"
], function() {
    "use strict";

    function initMap() {
        var map = new google.maps.Map(document.getElementById("map"), {
            zoom: 15,
            draggable: true,
            mapTypeControlOptions: {
                position: google.maps.ControlPosition.TOP_RIGHT
            }
        });

        map.addListener("click", function(e) {
            if(e.placeId) {
                console.log("Hello");
            }
        });

        return map;
    }

    function initPlacesService(map) {
        return new google.maps.places.PlacesService(map);
    }


    function addMarker(place, map, callback) {
        var marker = new google.maps.Marker({
            map:map,
            position: place.geometry.location
        });
        google.maps.event.addListener(marker, "click", callback);
        return marker;
    }

    function checkPlaceStatus(status) {
        return status == google.maps.places.PlacesServiceStatus.OK;
    }

    return {
        initMap: initMap,
        initPlacesService: initPlacesService,
        addMarker: addMarker,
        checkPlaceStatus: checkPlaceStatus
    };
});
