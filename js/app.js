require.config({
    paths: {
        knockout: "../bower_components/knockout/dist/knockout",
        jquery: "../bower_components/jquery/dist/jquery.min",
        googlemaps: "https://maps.googleapis.com/maps/api/js?key=AIzaSyCzrC2FBXXLfmnizhDmCHRVMaG6JQlvbvw&libraries=places"
    }
});

require([
    "knockout",
    "viewmodels/viewmodel"
], function(ko, ViewModel) {
    "use strict";

    ko.applyBindings(new ViewModel());


});
