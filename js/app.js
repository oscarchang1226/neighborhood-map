require.config({
    paths: {
        knockout: "../bower_components/knockout/dist/knockout"
    }
});

require([
    "knockout",
    "viewmodels/viewmodel"
], function(ko, ViewModel) {
    "use strict";

    var uluru = {lat: -25.363, lng: 131.004};
    var map = new google.maps.Map(document.getElementById("map"), {
        zoom: 4,
        center: {lat: 0, lng: 0},
        draggable: true
    });
    // map.setOptions({draggable: true});
    var marker = new google.maps.Marker({
        position: uluru,
        map:map
    });

    map.addListener("click", function(e) {
        var latLng = e.latLng;
        console.log({
            lat: latLng.lat(),
            lng: latLng.lng()
        });
    });

    ko.applyBindings(new ViewModel());


});
