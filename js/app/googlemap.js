define([
    'async!https://maps.googleapis.com/maps/api/js?key=AIzaSyCzrC2FBXXLfmnizhDmCHRVMaG6JQlvbvw'
], function() {

    var map;

    function initMap() {
        var springShadows = {lat: 29.8179022, lng: -95.53548160000001};
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 13,
            center: springShadows
        });
    }

    return {
        initMap: initMap
    };
});
