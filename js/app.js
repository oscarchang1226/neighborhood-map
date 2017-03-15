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

    viewModel.location.subscribe(function() {
        viewModel.location().imageIdx = ko.observable(0);
        var location = viewModel.location();
        if(!location.hasOwnProperty("international_phone_number")) {
            location.international_phone_number = "";
        }
        if(location.hasOwnProperty("photos")) {
            viewModel.imageUrl(location.photos[0].getUrl({maxWidth: 238, maxHeight: 180}));
        } else {
            if(location.hasOwnProperty("place_id")) {
                var url = `https://maps.googleapis.com/maps/api/streetview?size=238x180&location=`;
                url += `${location.geometry.location.lat()},${location.geometry.location.lng()}&key=AIzaSyCzrC2FBXXLfmnizhDmCHRVMaG6JQlvbvw`;
                viewModel.imageUrl(url);
            } else {
                viewModel.imageUrl("http://placehold.it/238x180");
            }
        }
        location.imageIdx.subscribe(function(idx) {
            viewModel.imageUrl(location.photos[idx].getUrl({maxWidth: 238, maxHeight: 180}));
        });
    });

    viewModel.focusedMarker.subscribe(function(previousMarker) {
        if(previousMarker.hasOwnProperty("animation") && previousMarker.getAnimation() !== null) {
            previousMarker.setAnimation(null);
        }
    }, null, "beforeChange");

    viewModel.focusedMarker.subscribe(function(marker) {
        viewModel.toggleMarkerBounce(marker);
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

    $("#demographics-button").click(function(e) {
        e.stopPropagation();
        viewModel.getDemographics();
        $("#demographics").toggleClass("close");
    });

    ko.applyBindings(viewModel);

}, function(err) {
    console.error("Unable to load dependencies.", err);
});
