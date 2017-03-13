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

    var viewModel = new ViewModel();
    var NEIGHBORHOOD_ID = "ChIJGZudLZ3FQIYREC4v5KoYUlg";

    viewModel.getPlaceDetails(NEIGHBORHOOD_ID, function(result, status) {
        if(viewModel.checkPlaceStatus(status)) {
            viewModel.setNeighborhood(result);
            var request = viewModel.generateSearchRequest();
            viewModel.searchNeighborhood(request);
        }
    });

    viewModel.userInput.subscribe(function(userInput) {
        var request;
        if(userInput && userInput.length > 2) {
            request = viewModel.generateSearchRequest(true);
            viewModel.searchNeighborhood(request);
        } else {
            request = viewModel.generateSearchRequest();
            viewModel.searchNeighborhood(request);
        }
        $("nav").removeClass("close");
        $("#location").addClass("close");
    });

    $("#location").hide();
    viewModel.location.subscribe(function(location) {
        if(location.place_id) {
            $("#location").show();
        } else {
            $("#location").hide();
        }
    });

    $("#menu-button").click(function(e) {
        e.stopPropagation();
        $("nav").toggleClass("close");
    });

    $("#location-button").click(function(e) {
        e.stopPropagation();
        if($("#location").hasClass("close")) {
            viewModel.locationButtonIcon("chevron_left");
        } else {
            viewModel.locationButtonIcon("chevron_right");
        }
        $("#location").toggleClass("close");
    });

    ko.applyBindings(viewModel);


});
