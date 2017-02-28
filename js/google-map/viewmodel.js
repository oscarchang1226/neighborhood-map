define(["knockout"], function(ko) {
    "use strict";

    function ViewModel() {
        var vm = this;

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

    }

    return ViewModel;
});
