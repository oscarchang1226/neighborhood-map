define([
    'async!https://maps.googleapis.com/maps/api/js?key=AIzaSyCzrC2FBXXLfmnizhDmCHRVMaG6JQlvbvw'
], function() {

    initMap();

    var map;

    function initMap() {
        var uluru = {lat: -25.363, lng: 131.044};
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 4,
            center: uluru
        });
    }

    return {
        initMap: initMap
    };
});
