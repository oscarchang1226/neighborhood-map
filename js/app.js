require.config({
    paths: {
        knockout: "../bower_components/knockout/dist/knockout",
        jquery: "../bower_components/jquery/dist/jquery.min",
        googlemaps: "https://maps.googleapis.com/maps/api/js?key=AIzaSyCzrC2FBXXLfmnizhDmCHRVMaG6JQlvbvw&libraries=places"
    }
});

require([
    "knockout",
    "jquery",
    "viewmodels/viewmodel"
], function(ko, $, ViewModel) {
    "use strict";

    $("#menu-button").click(function(e) {
        e.stopPropagation();
        $("nav").toggleClass("close");
    });

    ko.applyBindings(new ViewModel());


});
